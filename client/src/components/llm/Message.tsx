import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  Copy,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MarkdownContent from "@/components/markdown/MarkdownContent";
import type { Operation } from "@/base";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(aiResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <Collapsible defaultOpen={true}>
      <div className="w-full max-w-4xl mx-auto">
        <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 shadow-2xl overflow-hidden">
          <CardHeader className="border-b border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950">
            <div className="flex items-center gap-3 mb-3 justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <BookOpen className="h-5 w-5 text-primary" />
                </motion.div>
                <Badge
                  variant="outline"
                  className="bg-zinc-900/80 backdrop-blur-sm border-zinc-700/50 shadow-sm"
                >
                  Question #{chatId}
                </Badge>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CardTitle className="text-xl text-zinc-100">
              {userQuestion}
            </CardTitle>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="p-6">
              {!aiResponse ? (
                <div className="space-y-4">
                  <div className="text-center text-zinc-400">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p>Generating explanation...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-zinc-900 backdrop-blur-sm rounded-lg p-6 shadow-inner">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold text-zinc-100">
                          Explanation
                        </h2>
                      </div>
                      <button
                        onClick={handleCopy}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 text-sm rounded-md",
                          "transition-all duration-300 ease-out",
                          "border shadow-sm",
                          copied
                            ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                            : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-700/80 text-zinc-300"
                        )}
                      >
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              key="check"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              key="copy"
                            >
                              <Copy className="h-4 w-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <MarkdownContent
                        content={aiResponse}
                        operation={loading}
                      />
                    </div>
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
