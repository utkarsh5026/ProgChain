import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "@/store/explore/hook";
import AskQuestion from "@/components/explore/AskQuestion";
import Explanation from "@/components/explore/Explanation";
import ChatInput from "@/components/explore/ChatInput";
import { Button } from "@/components/ui/button";
import MinimapDrawer from "@/components/explore/MiniMapDrawer";
import { BookOpen, GraduationCap } from "lucide-react";

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
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const explanationsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isMinimapOpen, setIsMinimapOpen] = useState(false);

  useEffect(() => {
    const savedPreference = localStorage.getItem("minimapOpen");
    if (savedPreference !== null) {
      setIsMinimapOpen(savedPreference === "true");
    }
  }, []);

  const handleScroll = useCallback(() => {
    let closest = null;
    let closestDistance = Infinity;

    Object.entries(explanationsRef.current).forEach(([id, element]) => {
      if (element) {
        const distance = Math.abs(element.getBoundingClientRect().top);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = id;
        }
      }
    });

    setActiveQuestion(closest);
  }, [explanationsRef]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      resetExplore();
    } finally {
      setIsResetting(false);
    }
  };

  const scrollToQuestion = (questionId: string) => {
    const element = explanationsRef.current[questionId];
    if (element) {
      const headerOffset = 20;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "instant",
      });
    }
  };

  const toggleMinimap = () => {
    setIsMinimapOpen((prev) => !prev);
    localStorage.setItem("minimapOpen", (!isMinimapOpen).toString());
  };

  useEffect(() => {
    if (currentPath.length > 0) {
      const lastQuestionId = currentPath[currentPath.length - 1];
      scrollToQuestion(lastQuestionId);
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
        <MinimapDrawer
          isOpen={isMinimapOpen}
          onToggle={toggleMinimap}
          currentPath={currentPath}
          activeQuestion={activeQuestion}
          onQuestionClick={scrollToQuestion}
          getQuestion={getQuestion}
          onReset={handleReset}
          isResetting={isResetting}
        />

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Questions Content */}
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
                    <Explanation
                      questionID={questionID}
                      onRelatedQuestionClick={scrollToQuestion}
                    />
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

        <ChatInput onSubmit={handleChatSubmit} isLoading={isLoading} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Explore;
