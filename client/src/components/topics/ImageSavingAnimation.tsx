import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import React from "react";

const ImageSavingAnimationComponent: React.FC = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-xl"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <Loader2 className="h-10 w-10 animate-spin text-primary relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-white">
                Capturing your learning path
              </p>
              <p className="text-sm text-zinc-400">
                Creating a high-quality snapshot...
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ImageSavingAnimation = React.memo(ImageSavingAnimationComponent);

export default ImageSavingAnimation;
