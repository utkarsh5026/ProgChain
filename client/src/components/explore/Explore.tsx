import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "@/store/explore/hooks/use-explore";
import AskQuestion from "@/components/explore/AskQuestion";
import Explanation from "@/components/explore/Explanation";
import ChatInput from "@/components/llm/ChatInput";
import { Button } from "@/components/ui/button";

import Minimap from "@/components/llm/Minimap";
import { BookOpen, GraduationCap, Home } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const Explore: React.FC = () => {
  const { rootQuestion, currentPath, resetExplore, askQuestion, getQuestion } =
    useExplore();
  const [isResetting, setIsResetting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const explanationsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const scrollToMessage = (id: number) => {
    const element = explanationsRef.current[id];
    if (element) {
      element.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
      setActiveQuestion(id);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = Number(entry.target.getAttribute("data-message-id"));
            setActiveQuestion(id);
          }
        });
      },

      {
        rootMargin: "-100px 0px -100px 0px",
        threshold: 0.5,
      }
    );

    Object.values(explanationsRef.current).forEach((element) => {
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      resetExplore();
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    if (currentPath.length > 0) {
      const lastQuestionId = currentPath[currentPath.length - 1];
      scrollToMessage(lastQuestionId);
      setActiveQuestion(lastQuestionId);
    }
  }, [currentPath]);

  const handleChatSubmit = async (message: string) => {
    setIsLoading(true);
    try {
      await askQuestion(message, "gpt-4o-mini");
    } finally {
      setIsLoading(false);
    }
  };

  if (rootQuestion === null) return <AskQuestion />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 pb-32 rounded-lg"
      >
        <Minimap
          questions={currentPath.map((questionID) => ({
            id: questionID,
            text: getQuestion(questionID)?.text || "",
          }))}
          onQuestionClick={scrollToMessage}
          activeQuestionId={activeQuestion}
        />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="fixed top-4 right-4"
              >
                <Home className="h-5 w-5" />
              </Button>
            </TooltipTrigger>

            <TooltipContent>
              <p>Go back to the home page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div variants={itemVariants} className="space-y-8">
            {currentPath.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Start Your Learning Journey
                </h2>
                <p className="text-zinc-400">
                  Ask your first question to begin exploring
                </p>
              </div>
            ) : (
              currentPath.map((questionID, index) => (
                <motion.div
                  key={questionID}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                  ref={(el) => (explanationsRef.current[questionID] = el)}
                >
                  <div className="relative">
                    {index > 0 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-primary/20" />
                    )}
                    <Explanation questionID={questionID} />
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {currentPath.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="flex justify-center py-8"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleReset}
                disabled={isResetting}
                className="gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Start a New Learning Path
              </Button>
            </motion.div>
          )}
        </div>

        <div className="max-w-6xl mx-auto fixed bottom-0 left-0 right-0 z-10">
          <ChatInput onSubmit={handleChatSubmit} isLoading={isLoading} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Explore;
