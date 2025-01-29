import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import useExplore from "../../store/explore/hook";
import AskQuestion from "./AskQuestion";
import Explanation from "./Explanation";
import { Button } from "../ui/button";

/**
 * Explore Component
 *
 * This component manages the main exploration interface for programming questions.
 * It displays either the initial question input or the current exploration path with explanations.
 *
 * @component
 * @returns {React.ReactElement} The rendered Explore component
 */
const Explore: React.FC = () => {
  const { rootQuestion, currentPath, resetExplore } = useExplore();

  if (rootQuestion === null) return <AskQuestion />;

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
        className="flex flex-col relative"
      >
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={resetExplore} className="mr-4">
            Back to Start
          </Button>
        </div>
        {currentPath.map((questionID) => (
          <div key={questionID}>
            <Explanation questionID={questionID} />
          </div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default Explore;
