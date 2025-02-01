import { FileText, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export type Content = {
  id: string;
  text: string;
  timestamp: number;
};

const truncateText = (text: string, maxLength: number = 100): string => {
  const lines = text.split("\n");
  const firstLine = lines[0].trim();
  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.substring(0, maxLength) + "...";
};

const PastedContent = ({
  pastedContents,
  removePastedContent,
}: {
  pastedContents: Content[];
  removePastedContent: (id: string) => void;
}) => {
  return (
    pastedContents.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {pastedContents.map((content) => (
          <TooltipProvider key={content.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="group flex items-center gap-2 px-3 py-1.5 bg-zinc-800/90 
                                 rounded-lg border border-zinc-700/50 text-sm text-zinc-300
                                 hover:bg-zinc-800 transition-colors cursor-default"
                >
                  <FileText className="h-4 w-4 text-primary/70" />
                  <span className="truncate max-w-[200px]">
                    {truncateText(content.text, 30)}
                  </span>
                  <Button
                    onClick={() => removePastedContent(content.id)}
                    className="p-1 rounded-full hover:bg-zinc-700/50 text-zinc-400 
                                   hover:text-zinc-300 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-md p-3">
                <p className="font-medium mb-1">Pasted content preview:</p>
                <p className="text-sm text-zinc-400 whitespace-pre-wrap line-clamp-4">
                  {content.text}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    )
  );
};

export default PastedContent;
