import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTopics from "@/store/topics/hook";
import { SendHorizontal, BookOpen, Brain, Loader2 } from "lucide-react";
import AppTitle from "@/components/utils/AppTitile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AskTopic: React.FC = () => {
  const { generateConcepts } = useTopics();
  const [topic, setTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      generateConcepts(topic, [], false);
    } finally {
      console.log("done");
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-zinc-900 to-zinc-950"
      >
        <motion.div variants={itemVariants}>
          <Card className="w-full max-w-2xl mx-auto shadow-lg bg-gradient-to-b from-zinc-900/50 to-black/50 border-zinc-800 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex flex-col items-center space-y-8">
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-2 text-primary"
                >
                  <Brain className="w-8 h-8" />
                  <BookOpen className="w-8 h-8" />
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="text-center space-y-4"
                >
                  <AppTitle title="Master Your Interview Topics" size={2} />
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Enter any programming concept you'd like to learn for your
                    interview
                  </p>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="w-full space-y-4"
                >
                  <div className="relative">
                    <Input
                      className="w-full p-6 text-lg bg-white dark:bg-slate-900 border-2 focus:ring-2 focus:ring-primary"
                      placeholder="e.g., React Hooks, System Design, Data Structures..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isLoading) {
                          handleAskQuestion();
                        }
                      }}
                    />
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    className="w-full py-6 text-lg font-semibold flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 transition-colors"
                    onClick={handleAskQuestion}
                    disabled={isLoading || !topic.trim()}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Generate Learning Path</span>
                        <SendHorizontal className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AskTopic;
