import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "@/components/utils/Markdown";
import useExplore from "@/store/explore/hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Lightbulb,
  RefreshCw,
  CheckCircle,
  Copy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AILoadingAnimation from "./AILoadingAnimation";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface ExplanationProps {
  questionID: string;
  onRelatedQuestionClick: (questionID: string) => void;
}

const Explanation: React.FC<ExplanationProps> = ({ questionID }) => {
  const { getQuestion } = useExplore();
  const question = getQuestion(questionID);
  const [copied, setCopied] = useState(false);

  if (question === null) return null;

  const { text, explanation } = question;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.4 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50 shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950">
          <div className="flex items-center gap-3 mb-3">
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
              Question #{questionID}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold leading-tight text-zinc-100">
            <ReactMarkdown
              components={{
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    className="bg-zinc-800/80 rounded-md px-1.5 py-0.5 border border-zinc-700/50 font-mono text-sm"
                  >
                    {props.children}
                  </code>
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {!explanation ? (
            <div className="space-y-4">
              <AILoadingAnimation />
              <div className="text-center text-zinc-400">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p>Generating explanation...</p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="bg-zinc-800/20 backdrop-blur-sm rounded-lg p-6 border border-zinc-800/50 shadow-inner">
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
                  <Markdown content={explanation} />
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Explanation;
