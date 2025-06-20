export interface ProcessedFile {
  name: string;
  content: string;
  type: string;
}

export async function processFile(file: File): Promise<ProcessedFile> {
  try {
    // Handle text files (including CSV)
    if (
      file.type.startsWith("text/") ||
      file.name.toLowerCase().endsWith(".txt") ||
      file.name.toLowerCase().endsWith(".md") ||
      file.name.toLowerCase().endsWith(".csv")
    ) {
      try {
        const text = await file.text();
        return {
          name: file.name,
          content: text,
          type: "text",
        };
      } catch (error) {
        console.error("Text file processing error:", error);
        return {
          name: file.name,
          content: "[Error: Could not read text file.]",
          type: "text-error",
        };
      }
    }

    // Handle PDF files - treat as binary data
    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      try {
        // For PDFs, we'll include a note that it's a PDF file
        // The AI model can handle the binary data directly
        return {
          name: file.name,
          content: `[PDF file: ${file.name}] This is a PDF document. The AI model can analyze the content of this PDF file.`,
          type: "pdf",
        };
      } catch (error) {
        console.error("PDF processing error:", error);
        return {
          name: file.name,
          content: "[Error: Could not process PDF file.]",
          type: "pdf-error",
        };
      }
    }

    // Handle Excel files - return a message for now
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel" ||
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.name.toLowerCase().endsWith(".xls")
    ) {
      return {
        name: file.name,
        content:
          "[Excel files are not yet supported. Please convert to CSV format or copy the data manually.]",
        type: "excel-unsupported",
      };
    }

    // Handle Word documents
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/msword" ||
      file.name.toLowerCase().endsWith(".docx") ||
      file.name.toLowerCase().endsWith(".doc")
    ) {
      return {
        name: file.name,
        content:
          "[Word documents are not yet supported. Please convert to PDF or text format.]",
        type: "word-unsupported",
      };
    }

    // For unsupported file types, return a message
    return {
      name: file.name,
      content: `[Unsupported file type: ${
        file.type || "unknown"
      }] This file cannot be processed. Currently supported formats: Text (.txt, .md), CSV (.csv), PDF (.pdf). For other formats, please convert to text or copy the content manually.`,
      type: "unsupported",
    };
  } catch (error) {
    console.error(`Error processing file ${file.name}:`, error);
    return {
      name: file.name,
      content: `[Error processing file: ${
        error instanceof Error ? error.message : "Unknown error"
      }]`,
      type: "error",
    };
  }
}

export async function processFiles(
  files: FileList | File[]
): Promise<ProcessedFile[]> {
  const fileArray = Array.from(files);
  const processedFiles: ProcessedFile[] = [];

  for (const file of fileArray) {
    const processed = await processFile(file);
    processedFiles.push(processed);
  }

  return processedFiles;
}
