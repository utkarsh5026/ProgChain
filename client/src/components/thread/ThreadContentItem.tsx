import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import ContentHeader from "./ContentHeader";
import MarkdownContent from "../markdown/MarkdownContent";
import type { LearningContent } from "@/store/threads/types";
import type { Model } from "@/config/config";

interface LearningContentProps {
  content: LearningContent;
  onRegenerate?: (model: Model) => void;
}

const LearningContentDisplay: React.FC<LearningContentProps> = ({
  content,
  onRegenerate,
}) => {
  return (
    <div className="container py-8 px-bg-gradient-to-b from-zinc-950 to-black rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-zinc-800/30 bg-zinc-900/30 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

          {/* Content */}
          <div>
            <ContentHeader onRegenerate={onRegenerate} />
            <CardContent className="relative p-6 max-w-full max-h-[calc(100vh-200px)] overflow-y-auto">
              <MarkdownContent content={content.content} />
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LearningContentDisplay;
