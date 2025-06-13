import { Agent } from "@mastra/core/agent";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { NextRequest, NextResponse } from "next/server";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { messages, model } = body;

    if (!model || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Create dynamic agent
    const agent = new Agent({
      model: openrouter(model),
      name: "MultiAgent",
      instructions: "You are a helpful assistant.",
    });

    // Generate response
    const result = await agent.generate(messages);

    return NextResponse.json({
      role: "assistant",
      content: result.text,
    });
  } catch (err) {
    console.error("Agent error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
