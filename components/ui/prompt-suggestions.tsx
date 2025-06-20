interface PromptSuggestionsProps {
  label: string;
  append: (message: { role: "user"; content: string }) => void;
  suggestions: string[];
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="space-y-6">
      <h1 className="bg-gradient-to-r mt-10 from-blue-500 drop-shadow-lg to-purple-500 bg-clip-text text-transparent text-center text-4xl font-bold">
        Welcome to SakshamGPT
      </h1>
      <h2 className="text-center text-xl font-bold text-gray-500">{label}</h2>
      <div className="flex w-full drop-shadow-xl gap-4 text-[10px] md:text-md lg:text-lg tracking-tighter text-justify text-gray-700">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="h-auto w-auto flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
          >
            <p className=" tracking-tighter ">{suggestion}</p>
          </button>
        ))}
      </div>

      <div className="bg-white tracking-tighter dark:bg-gray-900 rounded-2xl shadow-md p-6 space-y-4 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-blue-600">
          📌 Guidelines for Best Results
        </h2>
        <div className="text-yellow-600 text-sm">
          ⚠️ Note: This chatbot is currently in{" "}
          <span className="font-semibold">beta/development phase</span> –
          we&apos;re actively improving it with new features and better model
          integrations!
        </div>

        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800 dark:text-gray-200">
          <li>
            <strong>Text Queries:</strong> Ask questions like “Summarize this
            PDF”.
          </li>
          <li>
            <strong>File Support:</strong> Upload PDF, Excel, or CSV files.
          </li>
          <li>
            <strong>Image Support:</strong> Coming soon.
          </li>
          <li>
            <strong>Web Scraping:</strong> Coming soon.
          </li>
          <li>
            <strong>Chat History:</strong> Coming soon with account login.
          </li>

          <li>
            <strong>LLM Switching:</strong> Currently supports only{" "}
            <strong>free local models</strong> (like LLaMA via Ollama). Support
            for <em>paid models</em> (e.g., GPT-4, Claude) will be added in
            future updates.
          </li>
        </ul>
        <span className="text-sm  text-red-500 font-bold">
          Giving you flexibility between performance and cost.
        </span>
      </div>
    </div>
  );
}
