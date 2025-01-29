import React from "react";
import Problems from "./Problems";
import { motion } from "framer-motion";

const Leetcode: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
    >
      <Problems />
    </motion.div>
  );
};

export default Leetcode;
