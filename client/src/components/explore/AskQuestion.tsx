import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "../../store/explore/hook";
import AppTitle from "../utils/AppTitile";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  BrainCircuit,
  Send,
  Sparkles,
  Code2,
  MessagesSquare,
} from "lucide-react";

const AskQuestion: React.FC = () => {
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const { fetchQuestion } = useExplore();

  const handleAskQuestion = () => {
    if (inputQuestion.trim()) {
      fetchQuestion(inputQuestion);
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
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const features = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-primary" />,
      text: "AI-powered responses",
    },
    {
      icon: <Code2 className="w-5 h-5 text-primary" />,
      text: "Detailed code explanations",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      text: "Learn programming concepts",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-2xl mx-auto p-6"
      >
        <Card className="w-full bg-gradient-to-b from-zinc-900 to-zinc-950 border-zinc-800 shadow-xl">
          <CardContent className="p-8">
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4 mb-8"
            >
              <MessagesSquare className="w-12 h-12 text-primary mx-auto mb-4" />
              <AppTitle title="What would you like to learn?" size={2} />
              <p className="text-zinc-400 text-lg">
                Ask any programming question and get detailed explanations
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="relative mb-8">
              <div className="relative">
                <Input
                  placeholder="e.g., How does React's useEffect hook work?"
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
                  className="w-full p-6 text-lg bg-zinc-900 border-2 border-zinc-800 focus:border-primary transition-colors rounded-xl pr-24"
                />
                <Button
                  onClick={handleAskQuestion}
                  disabled={!inputQuestion.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-6 left-4 text-sm text-zinc-500"
                  >
                    Press Enter to ask
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-3 gap-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex flex-col items-center text-center p-4 rounded-lg bg-zinc-900/50 border border-zinc-800"
                >
                  {feature.icon}
                  <span className="mt-2 text-sm text-zinc-400">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AskQuestion;
