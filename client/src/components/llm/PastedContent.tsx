import React from "react";
import { FileText, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import useChatInput from "@/store/chat-input/hook";

const PastedContent: React.FC = () => {
  const { pastedContents, removePastedContent } = useChatInput();

  if (pastedContents.length === 0) return null;

  if (pastedContents.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-2">
      {pastedContents.map((content) => (
        <TooltipProvider key={content.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="relative group flex items-center gap-3 px-4 py-2 bg-zinc-800/90 
                              rounded-xl border border-zinc-700/50 shadow-sm hover:bg-zinc-800 
                              hover:shadow-lg transition-all duration-200 cursor-default"
              >
                <FileText className="h-5 w-5 text-primary/80" />
                <span className="truncate max-w-[250px] text-sm">
                  {truncateText(content.content, 40)}
                </span>
                <button
                  onClick={() => removePastedContent(content.id)}
                  className="p-1 rounded-full hover:bg-red-500/20 text-zinc-400 
                             hover:text-red-500 transition-colors"
                  aria-label="Remove pasted content"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </TooltipTrigger>

            <TooltipContent
              side="top"
              className="max-w-lg p-4 bg-zinc-900 border border-zinc-700 shadow-lg rounded-lg"
            >
              <p className="font-semibold mb-1 text-white">
                Pasted content preview:
              </p>
              <p className="text-sm text-zinc-400 whitespace-pre-wrap line-clamp-4">
                {content.content}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

const truncateText = (text: string, maxLength: number = 100): string => {
  const lines = text.split("\n");
  const firstLine = lines[0].trim();
  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.substring(0, maxLength) + "...";
};

export default PastedContent;
