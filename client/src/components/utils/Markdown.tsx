import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MarkdownProps {
  content: string;
}

const CopiedCodeContent = ({ content }: { content: string }) => {
  return (
    <Card className="my-6 overflow-x-auto bg-zinc-950 border-zinc-800 border relative group">
      <pre>{content}</pre>
    </Card>
  );
};

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const { toast } = useToast();

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    if (selectedText) {
      navigator.clipboard
        .writeText(selectedText)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: selectedText,
            duration: 500,
          });
        })
        .catch(() => {
          toast({
            title: "Failed to copy",
            description: "Please try again",
            variant: "destructive",
            duration: 500,
          });
        });
    }
  }, [toast]);

  return (
    <div
      className="w-full max-w-none prose prose-invert prose-zinc bg-zinc-900 p-6 rounded-lg"
      onMouseUp={handleSelection}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={{
          // Headers with softer contrast and better spacing
          h1: ({ node, ...props }) => (
            <h1
              {...props}
              className="scroll-m-20 text-4xl font-bold tracking-tight text-zinc-100 mt-8 mb-6"
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              {...props}
              className="scroll-m-20 text-3xl font-semibold tracking-tight text-zinc-200 mt-8 mb-6"
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              {...props}
              className="scroll-m-20 text-2xl font-semibold tracking-tight text-zinc-300 mt-6 mb-4"
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              {...props}
              className="scroll-m-20 text-xl font-medium tracking-tight text-zinc-300 mt-6 mb-4"
            />
          ),

          // Math components with improved contrast
          math: ({ node, ...props }) => (
            <div {...props} className="my-4 text-zinc-200" />
          ),
          inlineMath: ({ node, ...props }) => (
            <span {...props} className="text-zinc-200" />
          ),

          // Paragraphs and text with gentler colors
          p: ({ node, ...props }) => (
            <p {...props} className="leading-7 text-zinc-400 mb-6" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-medium text-zinc-200" />
          ),
          em: ({ node, ...props }) => (
            <em {...props} className="italic text-blue-300" />
          ),

          // Lists with improved spacing and softer colors
          ul: ({ node, ...props }) => (
            <ul
              {...props}
              className="my-6 ml-6 list-disc space-y-3 text-zinc-400"
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              {...props}
              className="my-6 ml-6 list-decimal space-y-3 text-zinc-400"
            />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="leading-7 text-zinc-400" />
          ),

          // Links and blockquotes with gentler styling
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="font-medium text-blue-300 underline underline-offset-4 hover:text-blue-200 transition-colors duration-200"
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="mt-6 border-l-2 border-blue-400/30 pl-6 italic text-zinc-500"
            />
          ),

          pre: ({ node, ...props }) => {
            const codeElement = props.children;

            const extractText = (children: React.ReactNode): string => {
              let result = "";
              React.Children.forEach(children, (child) => {
                if (typeof child === "string") {
                  result += child;
                } else if (React.isValidElement(child)) {
                  result += extractText(child.props.children);
                }
              });
              return result;
            };

            const codeText = codeElement
              ? extractText(codeElement.props?.children)
              : "";

            const handleCopy = async () => {
              try {
                await navigator.clipboard.writeText(codeText);
                toast({
                  title: "Code copied",
                  description: <CopiedCodeContent content={codeText} />,
                  duration: 1500,
                });
              } catch (error) {
                console.error("Failed to copy:", error);
                toast({
                  title: "Failed to copy",
                  description: "Please try again",
                  variant: "destructive",
                  duration: 1500,
                });
              }
            };

            return (
              <Card className="my-6 overflow-x-auto bg-zinc-950 border-zinc-800 border relative group">
                <button
                  onClick={handleCopy}
                  className="absolute right-3 top-3 px-3 py-1.5 text-xs rounded-md bg-zinc-800/80 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-zinc-700/80"
                >
                  Copy
                </button>
                <pre
                  {...props}
                  className="p-6 rounded-lg font-mono text-sm font-light"
                />
              </Card>
            );
          },
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code
                {...props}
                className="relative rounded-md bg-zinc-800/50 px-2 py-1 font-mono text-sm text-blue-300 border border-zinc-700/50"
              />
            ) : (
              <code {...props} className="font-mono text-sm text-zinc-300" />
            ),

          // Tables with softer borders and better spacing
          table: ({ node, ...props }) => (
            <div className="my-8 w-full overflow-y-auto">
              <table
                {...props}
                className="w-full border-collapse text-sm text-zinc-400"
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead {...props} className="border-b border-zinc-800/50" />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} className="divide-y divide-zinc-800/30" />
          ),
          tr: ({ node, ...props }) => (
            <tr
              {...props}
              className="hover:bg-zinc-800/20 transition-colors duration-200"
            />
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="px-4 py-3 text-left font-medium text-zinc-300"
            />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="px-4 py-3 text-zinc-400" />
          ),

          // Horizontal rule with subtle styling
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-8 border-zinc-800/50" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
