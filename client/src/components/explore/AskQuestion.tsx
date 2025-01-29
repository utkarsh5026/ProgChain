import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "../../store/explore/hook";
import AppTitle from "../utils/AppTitile";
import { Input } from "../ui/input";

/**
 * AskQuestion Component
 *
 * This component renders an input field for users to ask programming-related questions.
 * It uses Framer Motion for animations and Ant Design for the input field.
 *
 * @component
 * @returns {React.ReactElement} The rendered AskQuestion component
 */
const AskQuestion: React.FC = () => {
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const { fetchQuestion } = useExplore();

  const handleAskQuestion = () => fetchQuestion(inputQuestion);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          delay: 0.2,
          type: "spring",
        }}
        className="flex flex-col items-center justify-center max-w-800px h-full m-0 auto p-4 rounded-8px"
      >
        <AppTitle title="Ask a Question" size={2} />
        <Input
          placeholder="Curious about something?"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAskQuestion();
            }
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AskQuestion;
