import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "@/store/explore/hook";
import { BrainCircuit, Send, GraduationCap, Blocks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import ModelSelect from "@/components/utils/ModelSelect";
import type { Model } from "@/config/config";
import RecentConversations from "./RecentConversations";

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

const AskQuestion: React.FC = () => {
  const [inputQuestion, setInputQuestion] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>("gpt-4o-mini");
  const { fetchQuestion } = useExplore();

  const handleAskQuestion = (question = inputQuestion) => {
    if (question.trim()) fetchQuestion(question, selectedModel);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen w-full p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
          from-zinc-900 via-zinc-950 to-black rounded-lg"
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
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br 
              from-primary/20 to-indigo-500/20 rounded-full blur-3xl"
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
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br 
              from-purple-500/20 to-primary/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto max-w-4xl">
          <motion.div
            variants={itemVariants}
            className="text-center mb-12 space-y-6"
          >
            <motion.div
              className="flex justify-center gap-6 mb-8"
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
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <GraduationCap className="w-14 h-14 text-primary" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Blocks className="w-14 h-14 text-primary/80" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <BrainCircuit className="w-14 h-14 text-primary/60" />
              </motion.div>
            </motion.div>

            <h1
              className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-primary via-indigo-400 to-primary animate-gradient"
            >
              Explore Programming Concepts
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light">
              Ask anything about programming and discover connected concepts
              through interactive learning
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative space-y-6">
            <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-8 md:p-12">
                <div className="space-y-6">
                  <div className="relative">
                    <div className="flex justify-start mb-4">
                      <ModelSelect onModelSelect={setSelectedModel} />
                    </div>
                    <div
                      className={cn(
                        "relative rounded-2xl transition-all duration-300",
                        "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
                        "p-[1px] group",
                        isTyping &&
                          "from-primary/20 via-primary/30 to-primary/20"
                      )}
                    >
                      <div className="relative bg-zinc-900/50 rounded-2xl overflow-hidden">
                        <Input
                          placeholder="What would you like to understand better?"
                          value={inputQuestion}
                          onChange={(e) => {
                            setInputQuestion(e.target.value);
                            setIsTyping(true);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && inputQuestion.trim()) {
                              handleAskQuestion();
                            }
                          }}
                          onBlur={() => setIsTyping(false)}
                          className={cn(
                            "w-full p-6 text-lg bg-transparent border-0",
                            "focus:ring-0 placeholder:text-zinc-500",
                            "transition-all duration-300"
                          )}
                        />
                        <Button
                          onClick={() => handleAskQuestion()}
                          disabled={!inputQuestion.trim()}
                          className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2",
                            "bg-primary hover:bg-primary/90 p-6",
                            "transition-all duration-300 group"
                          )}
                        >
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <Send
                              className="w-5 h-5 group-hover:transform group-hover:translate-x-1 
                              transition-transform"
                            />
                          </motion.div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <div className="mt-12">
            <RecentConversations />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AskQuestion;
