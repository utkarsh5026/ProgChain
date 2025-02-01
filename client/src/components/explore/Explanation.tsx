import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "@/components/utils/Markdown";
import useExplore from "@/store/explore/hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  BookOpen,
  Lightbulb,
  ArrowRight,
  Puzzle,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AILoadingAnimation from "./AILoadingAnimation";
import ReactMarkdown from "react-markdown";

interface ExplanationProps {
  questionID: string;
  onRelatedQuestionClick: (questionID: string) => void;
}

const Explanation: React.FC<ExplanationProps> = ({
  questionID,
  onRelatedQuestionClick,
}) => {
  const { getQuestion, fetchQuestion } = useExplore();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingQuestion, setLoadingQuestion] = useState<string | null>(null);

  const question = getQuestion(questionID);

  if (question === null) return null;

  const { text, explanation, relatedQuestionIDs } = question;

  const handleClick = async (questionId: string) => {
    setLoadingQuestion(questionId);
    try {
      onRelatedQuestionClick(questionId);
      await fetchQuestion(questionId);
    } finally {
      setLoadingQuestion(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl overflow-hidden">
        <CardHeader className="border-b border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-950">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <Badge variant="outline" className="bg-zinc-900">
              Question #{questionID}
            </Badge>
          </div>
          <CardTitle className="text-2xl font-bold leading-tight">
            <ReactMarkdown
              components={{
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    className="bg-zinc-800 rounded-md p-1 border border-zinc-700"
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
              <div className="bg-zinc-800/30 rounded-lg p-6 border border-zinc-800">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Explanation</h2>
                </div>
                <Markdown content={explanation} />
              </div>

              {/* Related Questions */}
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-zinc-800/50 rounded-lg transition-colors group">
                  <div className="flex items-center gap-2">
                    <Puzzle className="h-5 w-5 text-primary" />
                    <span className="font-medium">Related Questions</span>
                    <Badge variant="outline" className="ml-2 bg-zinc-900">
                      {relatedQuestionIDs.length}
                    </Badge>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-2">
                  <div className="bg-zinc-800/30 rounded-lg border border-zinc-800 overflow-hidden">
                    <ul className="divide-y divide-zinc-800">
                      <AnimatePresence>
                        {relatedQuestionIDs.map((item, index) => (
                          <motion.li
                            key={item}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => handleClick(item)}
                            className="flex items-center justify-between p-4 hover:bg-zinc-800 cursor-pointer transition-colors group"
                          >
                            <div className="flex items-center gap-2">
                              {loadingQuestion === item ? (
                                <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                              ) : (
                                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                              <span className="group-hover:text-primary transition-colors">
                                {item}
                              </span>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Explanation;
