import React, { useState } from "react";
import ModelSelect from "@/components/llm/ModelSelect";
import PromptTypeSelect from "@/components/llm/PromptTypeSelect";
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, DownloadIcon } from "lucide-react";
import type { Model } from "@/config/config";

interface ContentHeaderProps {
  onRegenerate: (model: Model) => void;
  onCapture?: () => void;
  onExplore?: () => void;
  isExploring?: boolean;
}

const ContentHeader: React.FC<ContentHeaderProps> = ({
  onRegenerate,
  onCapture,
  isExploring,
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

      {/* Mobile model info (topic indicator) – only show if not exploring */}
      {!isExploring && (
        <div className="sm:hidden">
          <p className="text-zinc-400 text-sm">
            <Sparkles className="w-4 h-4 inline-block mr-2 text-indigo-400/70" />
            Generated using {selectedModel}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentHeader;
