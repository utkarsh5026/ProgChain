import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { Card } from "@/components/ui/card";

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  // Custom components for markdown elements
  const components = {
    // Headers
    h1: ({ node, ...props }) => (
      <h1
        {...props}
        className="scroll-m-20 text-4xl font-bold tracking-tight text-white mt-8 mb-4"
      />
    ),
    h2: ({ node, ...props }) => (
      <h2
        {...props}
        className="scroll-m-20 text-3xl font-semibold tracking-tight text-white mt-8 mb-4"
      />
    ),
    h3: ({ node, ...props }) => (
      <h3
        {...props}
        className="scroll-m-20 text-2xl font-semibold tracking-tight text-white mt-6 mb-3"
      />
    ),
    h4: ({ node, ...props }) => (
      <h4
        {...props}
        className="scroll-m-20 text-xl font-semibold tracking-tight text-white mt-6 mb-3"
      />
    ),

    // Paragraphs and text
    p: ({ node, ...props }) => (
      <p {...props} className="leading-7 text-zinc-300 mb-4" />
    ),
    strong: ({ node, ...props }) => (
      <strong {...props} className="font-semibold text-white" />
    ),
    em: ({ node, ...props }) => (
      <em {...props} className="italic text-primary" />
    ),

    // Lists
    ul: ({ node, ...props }) => (
      <ul {...props} className="my-6 ml-6 list-disc space-y-2 text-zinc-300" />
    ),
    ol: ({ node, ...props }) => (
      <ol
        {...props}
        className="my-6 ml-6 list-decimal space-y-2 text-zinc-300"
      />
    ),
    li: ({ node, ...props }) => <li {...props} className="leading-7" />,

    // Links and blockquotes
    a: ({ node, ...props }) => (
      <a
        {...props}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      />
    ),
    blockquote: ({ node, ...props }) => (
      <blockquote
        {...props}
        className="mt-6 border-l-4 border-primary pl-6 italic text-zinc-400"
      />
    ),

    // Code blocks and inline code
    pre: ({ node, ...props }) => (
      <Card className="my-6 overflow-x-auto bg-zinc-900 border-zinc-800">
        <pre {...props} className="p-4 rounded-lg text-sm" />
      </Card>
    ),
    code: ({ node, inline, ...props }) =>
      inline ? (
        <code
          {...props}
          className="relative rounded-md bg-zinc-800 px-[0.3rem] py-[0.2rem] font-mono text-sm text-primary"
        />
      ) : (
        <code {...props} className="font-mono text-sm" />
      ),

    // Tables
    table: ({ node, ...props }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table
          {...props}
          className="w-full border-collapse text-sm text-zinc-300"
        />
      </div>
    ),
    thead: ({ node, ...props }) => (
      <thead {...props} className="border-b border-zinc-800" />
    ),
    tbody: ({ node, ...props }) => (
      <tbody {...props} className="divide-y divide-zinc-800" />
    ),
    tr: ({ node, ...props }) => (
      <tr {...props} className="hover:bg-zinc-800/50 transition-colors" />
    ),
    th: ({ node, ...props }) => (
      <th {...props} className="px-4 py-3 text-left font-medium text-white" />
    ),
    td: ({ node, ...props }) => <td {...props} className="px-4 py-3" />,

    // Horizontal rule
    hr: ({ node, ...props }) => (
      <hr {...props} className="my-8 border-zinc-800" />
    ),
  };

  return (
    <div className="w-full max-w-none prose prose-invert prose-zinc">
      <ReactMarkdown components={components} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default Markdown;
