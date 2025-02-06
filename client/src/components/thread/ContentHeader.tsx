import React, { useState } from "react";
import { motion } from "framer-motion";
import ModelSelect from "@/components/llm/ModelSelect";
import PromptTypeSelect from "@/components/llm/PromptTypeSelect";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, DownloadIcon, Compass } from "lucide-react";
import type { Model } from "@/config/config";

interface ContentHeaderProps {
  onRegenerate: (model: Model) => void;
  onCapture?: () => void;
  onExplore?: () => void;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  onRegenerate,
  onCapture,
  onExplore,
}: ContentHeaderProps) => {
  const [selectedModel, setSelectedModel] = useState<Model>("gpt-4o-mini");

  return (
    <div className="space-y-8 p-8 bg-gradient-to-b from-zinc-900/70 via-zinc-900/50 to-transparent rounded-t-xl border-b border-zinc-800/30">
      {/* Controls section */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Left side - Model info and regenerate */}
        <div className="flex flex-1 justify-start">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <ModelSelect onModelSelect={setSelectedModel} />
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10"
                onClick={() => onRegenerate?.(selectedModel)}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Center - Enhanced Explore button */}
        <div>
          <Button
            className="bg-black text-white hover:bg-zinc-800"
            onClick={onExplore}
          >
            <motion.span
              whileHover={{ rotate: 360 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-block mr-2"
            >
              <Compass className="w-5 h-5" />
            </motion.span>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1000,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="inline-block"
            >
              Explore
            </motion.span>
          </Button>
        </div>

        {/* Right side - Capture button and customization options */}
        <div className="flex flex-1 justify-end">
          <div className="flex items-center gap-3">
            {onCapture && (
              <Button
                variant="outline"
                size="sm"
                className="border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 transition-all duration-200 hover:bg-indigo-500/10"
                onClick={onCapture}
              >
                <DownloadIcon className="w-4 h-4" />
              </Button>
            )}
            <PromptTypeSelect />
          </div>
        </div>
      </div>

      {/* Mobile model info */}
      <div className="sm:hidden">
        <p className="text-zinc-400 text-sm">
          <Sparkles className="w-4 h-4 inline-block mr-2 text-indigo-400/70" />
          Generated using {selectedModel}
        </p>
      </div>
    </div>
  );
};

export default ContentHeader;
