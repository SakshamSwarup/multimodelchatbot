import { Dot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1">
      <div className="rounded-lg bg-muted p-3">
        <div className="flex -space-x-3">
          <Dot className="h-7 w-7 " />
          <Dot className="h-7 w-7  animate-bounce duration-100 " />
          <Dot className="h-7 w-7 animate-bounce duration-200 delay-100 " />
        </div>
      </div>
    </div>
  );
}
