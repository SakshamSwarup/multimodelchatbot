"use client";

import { useState } from "react";
import { useChat, type UseChatOptions } from "@ai-sdk/react";

import { cn } from "@/lib/utils";
import { Chat } from "@/components/ui/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "./card";

const MODELS = [
  {
    id: "google/gemma-3-4b-it:free",
    name: "Google Gemma 3 4B IT: free",
  },

  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "Deepseek Chat v3 0324:free",
  },

  {
    id: "qwen/qwen3-32b:free",
    name: "Qwen 3 32B: free",
  },

  {
    id: "google/gemma-3-12b-it:free",
    name: "Google Gemma 3 12B IT: free",
  },

  {
    id: "meta-llama/llama-3.3-8b-instruct:free",
    name: "Meta: Llama 3.3 8B Instruct (free)",
  },

  {
    id: "opengvlab/internvl3-14b:free",
    name: "OpengvLab Internvl3-14b: free",
  },

  {
    id: "moonshotai/kimi-vl-a3b-thinking:free",
    name: "Moonshot AI Kimi VL A3B Thinking: free",
  },
  {
    id: "microsoft/mai-ds-r1:free",
    name: "Microsoft Mai DS R1: free",
  },
];

type ChatDemoProps = {
  initialMessages?: UseChatOptions["initialMessages"];
};

export function ChatDemo(props: ChatDemoProps) {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    isLoading,
  } = useChat({
    ...props,
    streamProtocol: "text",
    api: "/api/chat",
    body: {
      model: selectedModel,
    },
  });

  return (
    <Card className={cn("w-full", "h-screen", "max-w-3xl")}>
      <CardContent className={cn("flex", "flex-col", "h-full", "w-full")}>
        {" "}
        <div className={cn("flex", "flex-col", "h-screen", "w-full")}>
          <div className={cn("flex", "justify-end", "mb-2")}>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Chat
            className="grow"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            messages={messages as any}
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
            isGenerating={isLoading}
            stop={stop}
            append={append}
            suggestions={[
              "Which came first: the chicken or the egg?",
              "If bald people work in a restaurant, do they still need to wear a hairnet?",
              "Explain the theory of relativity in simple terms.",
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
