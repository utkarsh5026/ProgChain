import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, Check, Copy } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const customTheme = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: 0,
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    fontSize: "0.875rem",
    lineHeight: "1.5",
    background: "transparent",
  },
};

const AIResponse = ({ content = "", isLoading = false }) => {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedStates, setCopiedStates] = useState(new Map());

  useEffect(() => {
    if (!content) return;

    if (currentIndex === 0) {
      setDisplayedContent("");
      setCopiedStates(new Map());
    }

    const typingInterval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      } else {
        clearInterval(typingInterval);
      }
    }, 1);

    return () => clearInterval(typingInterval);
  }, [content, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [content]);

  const handleCopy = useCallback(async (text, blockId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => new Map(prev).set(blockId, true));
      setTimeout(() => {
        setCopiedStates((prev) => {
          const newMap = new Map(prev);
          newMap.delete(blockId);
          return newMap;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  const CodeBlock = ({ node, inline, className, children }) => {
    // Safe conversion of children to string, handling undefined/null cases
    const content = children ? String(children) : "";

    // Determine if this should be a code block based on className and content
    const hasLanguageClass = className?.includes("language-");
    const hasMultipleLines = content.includes("\n");
    const isCodeBlock = !inline && (hasLanguageClass || hasMultipleLines);

    // Extract language from className
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "text";

    // Generate unique ID for code blocks
    const blockId = isCodeBlock ? Math.random().toString(36) : null;
    const isCopied = copiedStates.get(blockId);

    if (!isCodeBlock) {
      return (
        <code className="px-1.5 py-0.5 mx-0.5 bg-slate-700/10 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 rounded font-mono text-[0.875em]">
          {content}
        </code>
      );
    }

    return (
      <div className="relative group mt-4 mb-4">
        <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors flex items-center gap-1"
            onClick={() => handleCopy(content, blockId)}
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language={language}
            style={customTheme}
            customStyle={{
              padding: "1rem",
              paddingTop: "2rem",
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-4 bg-white dark:bg-slate-900 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {isLoading && currentIndex >= content?.length ? (
                <div className="flex items-center space-x-2">
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              ) : (
                <ReactMarkdown
                  components={{
                    code: CodeBlock,
                    h1: ({ node, ...props }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xl font-bold mt-5 mb-3" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-lg font-bold mt-4 mb-2" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-4 leading-relaxed" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-disc pl-6 mb-4" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol className="list-decimal pl-6 mb-4" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-2" {...props} />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic my-4"
                        {...props}
                      />
                    ),
                  }}
                >
                  {displayedContent}
                </ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponse;
