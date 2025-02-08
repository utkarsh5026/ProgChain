import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTopics from "@/store/topics/hook";
import { SendHorizontal, Loader2, Command, Brain, Blocks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ModelSelect from "@/components/llm/ModelSelect";
import PageHeader from "../utils/PageHeader";

import { type Model } from "@/config/config";

const AskTopicComponent: React.FC = () => {
  const { fetchTopics, loading } = useTopics();
  const [topic, setTopic] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleAskQuestion = async () => {
    if (!topic.trim()) return;
    await fetchTopics(topic, selectedModel as Model);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen w-full p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black"
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-indigo-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
              rotate: [45, 0, 45],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-primary/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto max-w-7xl">
          <PageHeader
            title="Discover Your Learning Path"
            description="Enter any programming concept to generate a personalized learning journey"
            icons={[
              <Brain className="w-14 h-14 text-primary" key="brain" />,
              <Blocks className="w-14 h-14 text-primary/80" key="blocks" />,
              <Command className="w-14 h-14 text-primary/60" key="command" />,
            ]}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto relative"
          >
            <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                    <ModelSelect onModelSelect={setSelectedModel} />
                  </div>

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
                    >
                      <Input
                        className={`w-full p-6 text-lg bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl 
                          placeholder:text-zinc-600 focus:ring-2 focus:ring-primary focus:border-transparent 
                          transition-all duration-300 ${
                            isInputFocused
                              ? "border-primary shadow-lg shadow-primary/20"
                              : ""
                          }`}
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
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleAskQuestion}
                    disabled={loading || !topic.trim()}
                    className={`w-full p-6 text-lg font-medium relative overflow-hidden
                      ${
                        loading
                          ? "bg-primary/50"
                          : "bg-primary hover:bg-primary/90"
                      }
                      transition-all duration-300 rounded-xl group
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
                      <div className="flex items-center justify-center gap-2 group">
                        <span>Generate Learning Path</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <SendHorizontal className="w-5 h-5 group-hover:transform group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Decorative elements */}
            <div className="absolute -z-10 inset-0 blur-3xl opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-purple-500/20 transform rotate-12" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const AskTopic = React.memo(AskTopicComponent);
export default AskTopic;
