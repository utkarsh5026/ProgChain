import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingAnimationProps {
  topicPath: string;
}

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ topicPath }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-[400px] space-y-6"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
      </div>
      <div className="text-center space-y-2">
        <p className="text-lg font-medium text-zinc-300 animate-pulse">
          Generating your learning path for {topicPath}...
        </p>
        <p className="text-sm text-zinc-500">
          Tailoring content to your skill level
        </p>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation;
