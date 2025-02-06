import React, { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import MarkDownTable from "./Table";
import CodeSegment from "./CodeSegment";

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  const { toast } = useToast();
  console.log(content);

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
      className="mx-auto w-full max-w-full prose prose-invert prose-zinc bg-zinc-900 p-6 rounded-lg"
      onMouseUp={handleSelection}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
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
              className="scroll-m-20 text-3xl font-semibold tracking-tight text-zinc-200 mt-12 mb-6"
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

          table: ({ node, ...props }) => <MarkDownTable props={props} />,

          tr: ({ node, ...props }) => (
            <tr {...props} className="border-b border-zinc-800" />
          ),

          th: ({ node, ...props }) => (
            <th
              {...props}
              className="px-4 py-3 text-left text-sm font-semibold text-zinc-200 whitespace-nowrap"
            />
          ),

          td: ({ node, ...props }) => (
            <td
              {...props}
              className="px-4 py-3 text-sm text-zinc-400 whitespace-nowrap"
            />
          ),

          pre: ({ node, ...props }) => <CodeSegment props={props} />,

          code: ({ node, ...props }) => (
            <code {...props} className="font-mono text-sm text-zinc-300" />
          ),
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

export default Markdown;
