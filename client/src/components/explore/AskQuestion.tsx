import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "../../store/explore/hook";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  BrainCircuit,
  Send,
  GraduationCap,
  Blocks,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AskQuestion: React.FC = () => {
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const { fetchQuestion } = useExplore();

  const examples = [
    "How does React's Virtual DOM work?",
    "Explain JavaScript closures",
    "What are TypeScript generics?",
  ];

  const handleAskQuestion = (question: string = inputQuestion) => {
    if (question.trim()) {
      fetchQuestion(question);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen w-full p-6 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black"
    >
      <div className="max-w-4xl mx-auto">
        <Card className="border-zinc-800/50 bg-black/50 shadow-2xl backdrop-blur-xl overflow-hidden">
          <CardContent className="p-8">
            {/* Header Section */}
            <motion.div
              variants={itemVariants}
              className="text-center space-y-6 mb-12"
            >
              <div className="flex justify-center gap-6">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex gap-4"
                >
                  <GraduationCap className="w-12 h-12 text-primary" />
                  <Blocks className="w-12 h-12 text-primary/80" />
                  <BrainCircuit className="w-12 h-12 text-primary/60" />
                </motion.div>
              </div>

              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary mb-3">
                  Explore Programming Concepts
                </h1>
                <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                  Ask anything about programming and discover connected concepts
                  through interactive learning
                </p>
              </div>
            </motion.div>

            {/* Search Section */}
            <motion.div variants={itemVariants} className="space-y-6 mb-12">
              <div className="relative">
                <div
                  className={cn(
                    "relative rounded-2xl transition-all duration-300",
                    "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
                    "p-[1px] group",
                    isTyping && "from-primary/20 via-primary/30 to-primary/20"
                  )}
                >
                  <div className="relative bg-zinc-900 rounded-2xl">
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
                        "bg-primary hover:bg-primary/90",
                        "transition-all duration-300"
                      )}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-8 left-4 text-sm text-zinc-500"
                    >
                      Press Enter to explore this concept
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {examples.map((example) => (
                  <motion.div
                    key={example}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => handleAskQuestion(example)}
                      className="bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
                      {example}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AskQuestion;
