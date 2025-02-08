import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Plus, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";

interface Question {
  id: number;
  text: string;
}

interface MinimapProps {
  questions: Question[];
  onQuestionClick: (id: number) => void;
  activeQuestionId?: number | null;
}

const Minimap: React.FC<MinimapProps> = ({
  questions,
  onQuestionClick,
  activeQuestionId,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isManuallyHidden, setIsManuallyHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY <= lastScrollY || currentScrollY < 100);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Collapsible open={!isManuallyHidden}>
      <div
        className={cn(
          "fixed right-4 top-20 w-64 transition-all duration-300 ease-in-out",

          "transform",
          isVisible ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="bg-black/20 backdrop-blur-md rounded-lg border border-zinc-800/50 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-400">Questions</h3>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsManuallyHidden((prev) => !prev)}
              >
                {isManuallyHidden ? <Plus /> : <Minus />}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <ScrollArea className="max-h-[calc(100vh-20rem)] h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {questions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => onQuestionClick(question.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors duration-200",
                      "hover:bg-white/5",
                      activeQuestionId === question.id
                        ? "bg-white/10 text-zinc-400"
                        : "text-zinc-400"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">
                        Q{question.id}
                      </span>
                      <span className="truncate">{question.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

export default Minimap;
