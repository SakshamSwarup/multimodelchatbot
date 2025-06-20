import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { NextRequest, NextResponse } from "next/server";
import { processFiles, ProcessedFile } from "@/lib/file-processor";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, model, experimental_attachments } = body;

    if (!model || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Process file attachments if present
    let processedFiles: ProcessedFile[] = [];
    const unsupportedFiles: string[] = [];

    if (experimental_attachments && experimental_attachments.length > 0) {
      try {
        // Convert data URLs back to File objects
        const files = experimental_attachments.map((attachment: Attachment) => {
          const dataArray = dataUrlToUint8Array(attachment.url);
          return new File([dataArray], attachment.name || "Unknown", {
            type: attachment.contentType || "application/octet-stream",
          });
        });

        // Filter supported files
        const supportedFiles = files.filter((file: File) => {
          const isText =
            file.type.startsWith("text/") ||
            file.name.toLowerCase().endsWith(".txt") ||
            file.name.toLowerCase().endsWith(".md") ||
            file.name.toLowerCase().endsWith(".csv");

          const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

          if (!isText && !isPdf) {
            unsupportedFiles.push(file.name);
          }

          return isText || isPdf;
        });

        // Only process supported files
        if (supportedFiles.length > 0) {
          processedFiles = await processFiles(supportedFiles);
        }

        // Add message about unsupported files
        if (unsupportedFiles.length > 0) {
          processedFiles.push({
            name: "Unsupported Files",
            content: `[The following files are not supported: ${unsupportedFiles.join(
              ", "
            )}. Please convert them to text (.txt), markdown (.md), CSV (.csv), or PDF (.pdf) format.]`,
            type: "unsupported",
          });
        }
      } catch (error) {
        console.error("Error processing attachments:", error);
        return NextResponse.json(
          { error: "Failed to process file attachments" },
          { status: 500 }
        );
      }
    }

    // Create enhanced messages with file content
    const enhancedMessages = [...messages];

    // If there are processed files, add their content to the last user message
    if (processedFiles.length > 0 && enhancedMessages.length > 0) {
      const lastMessage = enhancedMessages[enhancedMessages.length - 1];

      if (lastMessage.role === "user") {
        let fileContent = "\n\n**Attached Files Content:**\n";

        processedFiles.forEach((file) => {
          fileContent += `\n--- ${file.name} (${file.type}) ---\n`;

          // Truncate very long content to avoid API limits
          const maxLength = 8000; // Conservative limit
          if (file.content.length > maxLength) {
            fileContent +=
              file.content.substring(0, maxLength) +
              `\n\n[Content truncated - file is too large. Showing first ${maxLength} characters.]`;
          } else {
            fileContent += file.content;
          }
          fileContent += "\n";
        });

        // Check total message length
        const totalLength = lastMessage.content.length + fileContent.length;
        if (totalLength > 32000) {
          // Conservative limit for API
          fileContent =
            "\n\n**Attached Files Content:**\n[Files are too large to include full content. Please ask specific questions about the files.]";
        }

        enhancedMessages[enhancedMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + fileContent,
        };
      }
    }

    // Create dynamic agent
    const agent = new Agent({
      model: openrouter(model),
      name: "MultiAgent",
      instructions:
        "You are a helpful assistant. When analyzing files, provide detailed insights and answer questions based on the content provided. If files are mentioned but content is truncated, ask the user to be more specific about what they want to know.",
    });

    // Generate response
    const result = await agent.generate(enhancedMessages);

    const res_text = result.text.replace(/\\n/g, "\n");

    const cleaned = res_text;
    return NextResponse.json({
      role: "assistant",
      content: cleaned,
    });
  } catch (err) {
    console.error("Agent error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to convert data URL to Uint8Array
function dataUrlToUint8Array(data: string): Uint8Array {
  const base64 = data.split(",")[1];
  const buf = Buffer.from(base64, "base64");
  return new Uint8Array(buf);
}
