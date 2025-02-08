import React, { useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ContentHeader from "./ContentHeader";
import MarkdownContent from "@/components/markdown/MarkdownContent";
import type { LearningContent } from "@/store/threads/types";
import type { Model } from "@/config/config";
import useCapture from "@/hooks/use-capture";
import { useToast } from "@/hooks/use-toast";
interface LearningContentProps {
  content: LearningContent;
  onRegenerate?: (model: Model) => void;
  onExplore?: () => void;
  isExploring?: boolean;
}

const LearningContentDisplay: React.FC<LearningContentProps> = ({
  content,
  onRegenerate,
  onExplore,
  isExploring,
}) => {
  const markdownRef = useRef<HTMLDivElement>(null);
  const capture = useCapture();
  const { toast } = useToast();

  const handleCapture = async () => {
    if (markdownRef.current) {
      const clone = markdownRef.current.cloneNode(true) as HTMLElement;
      clone.style.maxHeight = "none";
      clone.style.overflow = "visible";
      clone.style.border = "none";
      clone.style.position = "absolute";
      clone.style.top = "-10000px";
      document.body.appendChild(clone);
      await capture(
        clone,
        "full-markdown-content",
        () =>
          toast({
            title: "Capture successful!",
            description: (
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
                <span>The full markdown content has been captured.</span>
              </div>
            ),
          }),
        () =>
          toast({
            title: "Capture failed",
            description:
              "There was an error capturing the content. Please try again.",
            variant: "destructive",
          })
      );

      // Remove the clone after capturing.
      document.body.removeChild(clone);
    }
  };

  return (
    <div className="container py-8 px-bg-gradient-to-b from-zinc-950 to-black rounded-lg">
      <motion.div className="max-w-4xl mx-auto">
        <Card className="border-zinc-800/30 bg-zinc-900/30 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Decorative elements with pointer-events disabled */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

          {/* Content */}
          <div>
            <ContentHeader
              onRegenerate={onRegenerate}
              onCapture={handleCapture}
              onExplore={onExplore}
              isExploring={isExploring}
            />
            {/* Bind the ref to the container that we want to capture */}
            <CardContent
              ref={markdownRef}
              className="relative p-6 max-w-full max-h-[calc(100vh-200px)] overflow-y-auto"
            >
              <MarkdownContent content={content.content} />
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LearningContentDisplay;
