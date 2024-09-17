import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "antd";
import { RollbackOutlined } from "@ant-design/icons";
import useExplore from "../../store/explore/hook";
import AskQuestion from "./AskQuestion";
import Explanation from "./Explanation";

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
          <Button
            type="primary"
            icon={<RollbackOutlined />}
            onClick={resetExplore}
            style={{ margin: "16px" }}
          >
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
