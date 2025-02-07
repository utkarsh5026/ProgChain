import React, { useState, useEffect } from "react";
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import { Loader2 } from "lucide-react";

interface SyntaxProps {
  selectedLanguage: string;
  generatedCode: string;
  isLoading?: boolean;
}

const Syntax = ({
  selectedLanguage,
  generatedCode,
  isLoading = false,
}: SyntaxProps) => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (!isLoading && generatedCode) {
      setDisplayedCode(generatedCode);
      setCurrentLine(generatedCode.split("\n").length);
    }
  }, [isLoading, generatedCode]);

  const renderLoadingPlaceholder = () => {
    return (
      <div className="w-full h-64 rounded-lg bg-zinc-900 p-4 relative overflow-hidden">
        {/* Top bar with language indicator */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <div className="px-2 py-1 rounded bg-zinc-800 text-zinc-400 text-sm ml-2">
            {selectedLanguage}
          </div>
        </div>

        {/* Animated code lines */}
        <div className="space-y-2">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-8 text-zinc-600 text-right">{index + 1}</div>
              <div
                className="h-4 bg-zinc-800 rounded animate-pulse"
                style={{
                  width: `${Math.random() * 40 + 60}%`,
                  animationDelay: `${index * 0.1}s`,
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Centered loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-zinc-900 bg-opacity-90 p-4 rounded-lg flex items-center space-x-3">
            <Loader2 className="animate-spin text-blue-500" />
            <span className="text-zinc-300">Generating code...</span>
          </div>
        </div>
      </div>
    );
  };

  return isLoading ? (
    renderLoadingPlaceholder()
  ) : (
    <div className="w-full rounded-lg overflow-hidden">
      <SyntaxHighlighter
        language={selectedLanguage.toLowerCase()}
        style={vs2015}
        customStyle={{
          padding: "1.5rem",
          borderRadius: "0.5rem",
          margin: 0,
        }}
      >
        {generatedCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default Syntax;
