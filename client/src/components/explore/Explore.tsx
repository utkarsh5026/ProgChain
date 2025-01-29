import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "@/store/explore/hook";
import AskQuestion from "@/components/explore/AskQuestion";
import Explanation from "@/components/explore/Explanation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Home,
  BookOpen,
  ChevronRight,
  RefreshCw,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Explore: React.FC = () => {
  const { rootQuestion, currentPath, resetExplore } = useExplore();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetExplore();
    } finally {
      setIsResetting(false);
    }
  };

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

  if (rootQuestion === null) return <AskQuestion />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 p-6"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            variants={itemVariants}
            className="sticky top-4 z-10 mb-6"
          >
            <Card className="bg-zinc-900/80 border-zinc-800 backdrop-blur-sm shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={isResetting}
                      className="text-zinc-400 hover:text-white"
                    >
                      {isResetting ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <Home className="h-5 w-5" />
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      {currentPath.map((id, index) => (
                        <React.Fragment key={id}>
                          {index > 0 && (
                            <ChevronRight className="h-4 w-4 text-zinc-600" />
                          )}
                          <Badge
                            variant="outline"
                            className={`${
                              index === currentPath.length - 1
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-zinc-900"
                            }`}
                          >
                            Question {index + 1}
                          </Badge>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    disabled={isResetting}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    New Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

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
      </motion.div>
    </AnimatePresence>
  );
};

export default Explore;
