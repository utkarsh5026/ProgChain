import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Copy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MarkdownContent from "@/components/markdown/MarkdownContent";
import type { Operation } from "@/base";

interface MessageProps {
  userQuestion: string;
  aiResponse: string;
  chatId: number;
  loading: Operation;
}

const Message: React.FC<MessageProps> = ({
  userQuestion,
  aiResponse,
  chatId,
  loading,
}) => {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isOpen]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div ref={messageRef} className="w-full max-w-4xl mx-auto scroll-mt-4">
        <Card className="bg-white/5 backdrop-blur-sm border-zinc-800/50">
          <div className="sticky top-0 z-10 relative">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-lg" />

            <CardHeader className="border-b border-zinc-800/50 pb-4 relative">
              <div className="flex items-center justify-between relative">
                <span className="text-sm text-zinc-400">Q{chatId}</span>

                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "p-1 transition-transform duration-200",
                      !isOpen && "rotate-180"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </div>
              <h2 className="text-lg font-medium text-zinc-100 mt-2 relative">
                {userQuestion}
              </h2>
            </CardHeader>
          </div>

          <CollapsibleContent>
            <CardContent className="p-4">
              {!aiResponse ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-zinc-400">
                    Generating...
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <button
                      onClick={handleCopy}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1 text-sm rounded",
                        "transition-colors duration-200",
                        copied
                          ? "text-emerald-400"
                          : "text-zinc-400 hover:text-zinc-200"
                      )}
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="text-xs">
                        {copied ? "Copied" : "Copy"}
                      </span>
                    </button>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <MarkdownContent content={aiResponse} operation={loading} />
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </div>
    </Collapsible>
  );
};

export default Message;
