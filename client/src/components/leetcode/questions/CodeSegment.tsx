import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import CodeActions from "./CodeActions";
import GenerationPanel from "./GenerationPanel";
import CodeDisplay from "./CodeDisplay";
import { languages, models, type Language, type Model } from "@/config/config";
import { useProblem } from "@/store/leetcode/hook";

const CodeSegment: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0]
  );
  const { problemInfo, generateSolution } = useProblem();

  const solutionsMap = useMemo(() => {
    return problemInfo?.solution || {};
  }, [problemInfo]);

  const defaultPrompt =
    "Generate an efficient and well-commented solution with explanation of approach";

  const handleGenerateCode = async (promptText = customPrompt) => {
    if (!problemInfo) return;

    setIsGenerating(true);
    setGenerationError("");
    try {
      await generateSolution({
        model: selectedModel,
        problemId: problemInfo.problem.id,
        progLang: selectedLanguage,
        additionalContext: promptText || defaultPrompt,
      });
    } catch (error) {
      console.error("Error generating code:", error);
      setGenerationError("Failed to generate code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    handleGenerateCode(defaultPrompt);
  }, [selectedLanguage]);

  const handleCopyCode = async () => {
    const codeToCopy =
      generatedCode || solutionsMap[selectedLanguage]?.code || "";
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
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      <AnimatePresence>
        {isGenerateOpen && (
          <GenerationPanel
            generationError={generationError}
            generatedCode={generatedCode}
            selectedLanguage={selectedLanguage}
            closePanel={() => setIsGenerateOpen(false)}
          />
        )}
      </AnimatePresence>

      <CodeDisplay
        selectedLanguage={selectedLanguage}
        generatedCode={solutionsMap[selectedLanguage]?.code || ""}
      />
    </div>
  );
};

export default CodeSegment;
