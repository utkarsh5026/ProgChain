import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTopics from "@/store/topics/hook";
import { SendHorizontal, Brain, Loader2, Sparkles, Cloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AskTopic: React.FC = () => {
  const { fetchTopics, loading } = useTopics();
  const [topic, setTopic] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleAskQuestion = async () => {
    if (!topic.trim()) return;
    await fetchTopics(topic, "gpt-4o-mini");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen w-full p-4 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black"
      >
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 space-y-4"
          >
            <motion.div
              className="flex justify-center gap-4 mb-6"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-12 h-12 text-primary" />
              <Cloud className="w-12 h-12 text-primary/80" />
              <Brain className="w-12 h-12 text-primary/60" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-400 to-primary">
              Discover Your Learning Path
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Enter any programming concept to generate a personalized learning
              journey
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="max-w-3xl mx-auto relative"
          >
            <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-24">
                <div className="relative">
                  <motion.div
                    animate={
                      isInputFocused
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(255,255,255,0)",
                              "0 0 20px 2px rgba(255,255,255,0.1)",
                              "0 0 0 0 rgba(255,255,255,0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <Input
                      className={`w-full p-8 text-lg bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl placeholder:text-zinc-600
                        focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300
                        ${
                          isInputFocused
                            ? "border-primary shadow-lg shadow-primary/20"
                            : ""
                        }
                      `}
                      placeholder="e.g., React Hooks, System Design, Data Structures..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading && topic.trim()) {
                          handleAskQuestion();
                        }
                      }}
                    />
                  </motion.div>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleAskQuestion}
                    disabled={loading || !topic.trim()}
                    className={`w-full mt-4 p-8 text-lg font-medium relative overflow-hidden
                      ${
                        loading
                          ? "bg-primary/50"
                          : "bg-primary hover:bg-primary/90"
                      }

                      transition-all duration-300 rounded-xl
                    `}
                  >
                    <motion.div
                      animate={
                        !loading
                          ? {
                              background: [
                                "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)",

                                "linear-gradient(0deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
                                "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 100%)",
                              ],
                            }
                          : {}
                      }
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0"
                    />

                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 className="w-6 h-6" />
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>Generate Learning Path</span>
                        <SendHorizontal className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AskTopic;
