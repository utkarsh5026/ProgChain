import React, { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Camera, Download, Trophy } from "lucide-react";
import type { TopicConcepts, Concept } from "../../store/topics/types";
import DifficultyCard from "./DifficultyCard";
import useTopics from "../../store/topics/hook";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [showSuccess, setShowSuccess] = useState(false);
  const { generateConcepts } = useTopics();

  const saveAsPNG = useCallback(async () => {
    if (containerRef.current) {
      setIsSaving(true);
      try {
        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: null,
          scale: 2,
          logging: false,
        });

        const paddedCanvas = document.createElement("canvas");
        const ctx = paddedCanvas.getContext("2d");
        const padding = 48;
        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2;

        if (ctx) {
          // Create sophisticated gradient background
          const gradient = ctx.createRadialGradient(
            paddedCanvas.width / 2,
            paddedCanvas.height / 2,
            0,
            paddedCanvas.width / 2,
            paddedCanvas.height / 2,
            paddedCanvas.width / 2
          );
          gradient.addColorStop(0, "#1a1b1e");
          gradient.addColorStop(1, "#141517");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);

          // Add decorative border with gradient
          const borderGradient = ctx.createLinearGradient(
            0,
            0,
            paddedCanvas.width,
            paddedCanvas.height
          );
          borderGradient.addColorStop(0, "rgba(59, 130, 246, 0.2)");
          borderGradient.addColorStop(0.5, "rgba(147, 51, 234, 0.2)");
          borderGradient.addColorStop(1, "rgba(59, 130, 246, 0.2)");
          ctx.strokeStyle = borderGradient;
          ctx.lineWidth = 3;
          ctx.strokeRect(
            padding - 8,
            padding - 8,
            canvas.width + 16,
            canvas.height + 16
          );

          // Draw main content
          ctx.drawImage(canvas, padding, padding);

          // Add sophisticated watermark
          ctx.save();
          ctx.font = "bold 32px system-ui";
          ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.translate(paddedCanvas.width / 2, paddedCanvas.height / 2);
          ctx.rotate(-Math.PI / 8);
          ctx.fillText("ProgChain Learning Path", 0, 0);

          // Add timestamp
          ctx.font = "16px system-ui";
          ctx.fillText(new Date().toLocaleDateString(), 0, 30);
          ctx.restore();
        }

        const link = document.createElement("a");
        link.download = `${topic.replace(/\//g, "-")}_learning_path.png`;
        link.href = paddedCanvas.toDataURL();
        link.click();

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
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

  if (isLoading) {
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
            Generating your learning path...
          </p>
          <p className="text-sm text-zinc-500">
            Tailoring content to your skill level
          </p>
        </div>
      </motion.div>
    );
  }

  if (!topics) {
    return (
      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardContent className="flex flex-col items-center justify-center h-[400px] space-y-6">
          <div className="p-4 bg-zinc-800/30 rounded-full">
            <BookOpen className="h-12 w-12 text-zinc-400" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h3 className="text-2xl font-semibold text-zinc-300">
              No topics available yet
            </h3>
            <p className="text-zinc-400">
              Start your learning journey by selecting a new topic or try
              refreshing the page
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Your Learning Path
            </h2>
            <p className="text-sm text-zinc-400">
              Master concepts at your own pace
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={saveAsPNG}
            disabled={isSaving}
            className="bg-primary/10 hover:bg-primary/20 text-primary font-medium gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            Capture Path
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30">
              <AlertDescription className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Learning path captured successfully!
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 rounded-xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />

        <div className="relative p-8 rounded-xl border border-zinc-800/50 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(topics).map(([difficulty, conceptList], index) => (
              <motion.div
                key={difficulty}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
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
        </div>
      </motion.div>

      <AnimatePresence>
        {isSaving && (
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicDisplay;
