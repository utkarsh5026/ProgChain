import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { TopicConcepts, Concept } from "../../store/topics/types";
import DifficultyCard from "./DifficultyCard";
import useTopics from "../../store/topics/hook";

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

  const saveAsPNG = useCallback(async () => {
    if (containerRef.current) {
      setIsSaving(true);
      try {
        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: null,
          scale: 2,
        });
        const paddedCanvas = document.createElement("canvas");
        const ctx = paddedCanvas.getContext("2d");
        const padding = 20;
        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2;

        if (ctx) {
          ctx.fillStyle = "#4a4a4a";
          ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
          ctx.fillStyle = "#1f1f1f";
          ctx.fillRect(padding, padding, canvas.width, canvas.height);
          ctx.drawImage(canvas, padding, padding);

          ctx.font = "bold 24px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.translate(paddedCanvas.width / 2, paddedCanvas.height / 2);
          ctx.rotate(-Math.PI / 4);
          ctx.fillText("ProgChain", 0, 0);
        }

        const link = document.createElement("a");
        link.download = `${topic}_topics.png`;
        link.href = paddedCanvas.toDataURL();
        link.click();
      } finally {
        setIsSaving(false);
      }
    }
  }, [containerRef, topic]);

  const handleConceptClick = (concept: Concept) => {
    const parts = topic.split("/");
    const mainTopic = parts[0];
    const context = parts.length > 1 ? parts.slice(1) : [];
    context.push(concept.topic);

    console.log(mainTopic, context);
    generateConcepts(mainTopic, context, false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!topics) {
    return <h3 className="text-2xl font-semibold">No topics available</h3>;
  }

  return (
    <div>
      <Button onClick={saveAsPNG} className="mb-5" disabled={isSaving}>
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save as PNG
      </Button>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-5 bg-zinc-900 rounded-lg"
      >
        <div className="flex flex-wrap gap-5 justify-center">
          {Object.entries(topics).map(([difficulty, conceptList], index) => (
            <motion.div
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          >
            <p className="text-white text-2xl">Saving...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicDisplay;
