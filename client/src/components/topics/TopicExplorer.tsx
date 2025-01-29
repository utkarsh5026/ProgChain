import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Camera } from "lucide-react";
import type { TopicConcepts, Concept } from "../../store/topics/types";
import DifficultyCard from "./DifficultyCard";
import useTopics from "../../store/topics/hook";
import { Card, CardContent } from "@/components/ui/card";

interface TopicDisplayProps {
  topic: string;
  topics: TopicConcepts;
  isLoading: boolean;
}

const TopicDisplay: React.FC<TopicDisplayProps> = ({
  topic,
  topics,
  isLoading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { generateConcepts } = useTopics();

  // Enhanced PNG export with watermark and padding
  const saveAsPNG = useCallback(async () => {
    if (containerRef.current) {
      setIsSaving(true);
      try {
        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: null,
          scale: 2,
          logging: false,
        });

        // Create padded canvas with enhanced styling
        const paddedCanvas = document.createElement("canvas");
        const ctx = paddedCanvas.getContext("2d");
        const padding = 40;
        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2;

        if (ctx) {
          // Create gradient background
          const gradient = ctx.createLinearGradient(
            0,
            0,
            paddedCanvas.width,
            paddedCanvas.height
          );
          gradient.addColorStop(0, "#1a1a1a");
          gradient.addColorStop(1, "#2a2a2a");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

          // Add subtle border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 2;
          ctx.strokeRect(
            padding - 5,
            padding - 5,
            canvas.width + 10,
            canvas.height + 10
          );

          // Draw main content
          ctx.drawImage(canvas, padding, padding);

          // Add watermark with enhanced styling
          ctx.save();
          ctx.font = "bold 28px system-ui";
          ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.translate(paddedCanvas.width / 2, paddedCanvas.height / 2);
          ctx.rotate(-Math.PI / 6);
          ctx.fillText("ProgChain Learning Path", 0, 0);
          ctx.restore();
        }

        const link = document.createElement("a");
        link.download = `${topic.replace(/\//g, "-")}_learning_path.png`;
        link.href = paddedCanvas.toDataURL();
        link.click();
      } finally {
        setIsSaving(false);
      }
    }
  }, [containerRef, topic]);

  const handleConceptClick = useCallback(
    (concept: Concept) => {
      const parts = topic.split("/");
      const mainTopic = parts[0];
      const context = parts.length > 1 ? parts.slice(1) : [];
      context.push(concept.topic);
      generateConcepts(mainTopic, context, false);
    },
    [topic, generateConcepts]
  );

  // Loading state with enhanced animation
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center h-[300px] space-y-4"
      >
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-zinc-400 animate-pulse">Loading learning path...</p>
      </motion.div>
    );
  }

  // Empty state with better visual feedback
  if (!topics) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center h-[300px] space-y-4">
          <BookOpen className="h-12 w-12 text-zinc-600" />
          <h3 className="text-2xl font-semibold text-zinc-400">
            No topics available
          </h3>
          <p className="text-zinc-500">
            Try exploring a different topic or refreshing the page
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button
          onClick={saveAsPNG}
          disabled={isSaving}
          className="dark:bg-primary/20 dark:text-primary font-medium"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          Capture Path
        </Button>
      </div>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-xl border border-zinc-800/50 shadow-xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(topics).map(([difficulty, conceptList], index) => (
            <motion.div
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <DifficultyCard
                difficulty={difficulty}
                conceptList={conceptList}
                onConceptClick={handleConceptClick}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-black/60 flex flex-col justify-center items-center gap-4 z-50"
          >
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-xl">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-lg font-medium text-white">
                  Capturing your learning path...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicDisplay;
