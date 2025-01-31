import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import CodeActions from "./CodeActions";
import GenerationPanel from "./GenerationPanel";
import CodeDisplay from "./CodeDisplay";
import type { Solution } from "@/store/leetcode/type";

interface CodeSegmentProps {
  solution: Solution[];
  selectedLanguage: string;
}

const CodeSegment: React.FC<CodeSegmentProps> = ({
  solution,
  selectedLanguage,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const defaultPrompt =
    "Generate an efficient and well-commented solution with explanation of approach";

  const handleGenerateCode = async (promptText = customPrompt) => {
    setIsGenerating(true);
    setGenerationError("");

    try {
      const response = await fetch("/api/generate-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: promptText || defaultPrompt,
          model: selectedModel,
          language: selectedLanguage,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate code");

      const data = await response.json();
      setGeneratedCode(data.code);
    } catch (error) {
      console.error("Error generating code:", error);
      setGenerationError("Failed to generate code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate code when component mounts
  useEffect(() => {
    handleGenerateCode(defaultPrompt);
  }, [selectedLanguage]);

  const handleCopyCode = async () => {
    const codeToCopy =
      generatedCode ||
      solution.find((s) => s.language === selectedLanguage)?.code ||
      "";
    await navigator.clipboard.writeText(codeToCopy);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <CodeActions
        handleCopyCode={handleCopyCode}
        handleGenerateCode={handleGenerateCode}
        showCopied={showCopied}
        isGenerateOpen={isGenerateOpen}
        setIsGenerateOpen={setIsGenerateOpen}
      />

      <AnimatePresence>
        {isGenerateOpen && (
          <GenerationPanel
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isGenerating={isGenerating}
            handleGenerateCode={handleGenerateCode}
            generationError={generationError}
            generatedCode={generatedCode}
            selectedLanguage={selectedLanguage}
          />
        )}
      </AnimatePresence>

      <CodeDisplay
        selectedLanguage={selectedLanguage}
        generatedCode={generatedCode}
      />
    </div>
  );
};

export default CodeSegment;
