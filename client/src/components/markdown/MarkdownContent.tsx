import React, { useCallback, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github-dark.css";
import { useToast } from "@/hooks/use-toast";

import MarkDownTable from "./Table";
import CodeSegment from "./CodeSegment";
import HoverableContentWrapper from "./HoverableContentWrapper";
import type { Operation } from "@/base";

interface MarkdownProps {
  content: string;
  operation?: Operation;
}

const Markdown: React.FC<MarkdownProps> = ({ content, operation }) => {
  const { toast } = useToast();

  const currentIndexRef = useRef<number>(0);
  useEffect(() => {
    currentIndexRef.current = 0;
  }, [content]);

  const getIndicesForText = (
    text: string
  ): { startIndex: number; endIndex: number } => {
    if (!text || text.trim() === "") {
      return {
        startIndex: currentIndexRef.current,
        endIndex: currentIndexRef.current,
      };
    }
    const fromIndex = 0;
    let foundIndex = content.indexOf(text, fromIndex);
    if (foundIndex === -1) {
      foundIndex = currentIndexRef.current;
    }
    const startIndex = foundIndex;
    const endIndex = foundIndex + text.length;

    currentIndexRef.current = endIndex;

    return { startIndex, endIndex };
  };

  // Handle copying on text selection within the markdown view.
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
          // For headings, paragraphs, and list items we wrap them in the HoverableContentWrapper,
          // passing the full markdown content and the computed startIndex/endIndex for that element.
          h1: ({ node, ...props }) => {
            const text = extractText(props.children);
            const { startIndex, endIndex } = getIndicesForText(text);
            return (
              <HoverableContentWrapper
                content={text}
                fullContent={content}
                startIndex={startIndex}
                endIndex={endIndex}
              >
                <h1
                  {...props}
                  className="scroll-m-20 text-4xl font-bold tracking-tight text-zinc-100 mt-8 mb-6"
                />
              </HoverableContentWrapper>
            );
          },
          h2: ({ node, ...props }) => {
            const text = extractText(props.children);
            const { startIndex, endIndex } = getIndicesForText(text);
            return (
              <HoverableContentWrapper
                content={text}
                fullContent={content}
                startIndex={startIndex}
                endIndex={endIndex}
              >
                <h2
                  {...props}
                  className="scroll-m-20 text-3xl font-semibold tracking-tight text-zinc-200 mt-12 mb-6"
                />
              </HoverableContentWrapper>
            );
          },
          h3: ({ node, ...props }) => {
            const text = extractText(props.children);
            const { startIndex, endIndex } = getIndicesForText(text);
            return (
              <HoverableContentWrapper
                content={text}
                fullContent={content}
                startIndex={startIndex}
                endIndex={endIndex}
              >
                <h3
                  {...props}
                  className="scroll-m-20 text-2xl font-semibold tracking-tight text-zinc-300 mt-6 mb-4"
                />
              </HoverableContentWrapper>
            );
          },
          h4: ({ node, ...props }) => {
            const text = extractText(props.children);
            const { startIndex, endIndex } = getIndicesForText(text);
            return (
              <HoverableContentWrapper
                content={text}
                fullContent={content}
                startIndex={startIndex}
                endIndex={endIndex}
              >
                <h4
                  {...props}
                  className="scroll-m-20 text-xl font-medium tracking-tight text-zinc-300 mt-6 mb-4"
                />
              </HoverableContentWrapper>
            );
          },
          p: ({ node, ...props }) => {
            const text = extractText(props.children);
            const { startIndex, endIndex } = getIndicesForText(text);
            return (
              <HoverableContentWrapper
                content={text}
                fullContent={content}
                startIndex={startIndex}
                endIndex={endIndex}
              >
                <p {...props} className="leading-7 text-zinc-400 mb-6" />
              </HoverableContentWrapper>
            );
          },
          li: ({ node, ...props }) => {
            const text = extractText(props.children);
            const { startIndex, endIndex } = getIndicesForText(text);

            return (
              <HoverableContentWrapper
                content={text}
                fullContent={content}
                startIndex={startIndex}
                endIndex={endIndex}
              >
                <li {...props} className="leading-7 text-zinc-400" />
              </HoverableContentWrapper>
            );
          },
          strong: ({ node, ...props }) => (
            <strong
              {...props}
              className="font-medium text-zinc-200 strong-text"
            />
          ),
          em: ({ node, ...props }) => (
            <em {...props} className="italic text-blue-300" />
          ),
          ul: ({ node, ...props }) => (
            <ul
              {...props}
              className="my-8 ml-6 list-disc space-y-3 text-zinc-400"
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              {...props}
              className="my-8 ml-6 list-decimal space-y-3 text-zinc-400"
            />
          ),
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
              className="px-4 py-3 text-left text-sm font-semibold text-zinc-200 whitespace-normal break-words"
            />
          ),
          td: ({ node, ...props }) => (
            <td
              {...props}
              className="px-4 py-3 text-sm text-zinc-400 whitespace-normal break-words"
            />
          ),
          pre: ({ node, ...props }) => <CodeSegment props={props} />,
          code: ({ node, ...props }) => (
            <code
              {...props}
              className="font-mono text-sm text-zinc-300 code-text"
            />
          ),
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-8 border-zinc-800/50" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
      {operation && <StatusIndicator operation={operation} />}
    </div>
  );
};

export default Markdown;

const extractText = (children: React.ReactNode): string => {
  let result = "";
  React.Children.forEach(children, (child) => {
    if (typeof child === "string") {
      result += child;
    } else if (React.isValidElement(child)) {
      const extractedText = extractText(child.props.children);
      result += wrapTextWithMarkdownSyntax(extractedText, child);
    }
  });
  return result;
};

const wrapTextWithMarkdownSyntax = (
  text: string,
  element:
    | React.ReactPortal
    | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
) => {
  const getElementName = (element: any) => {
    return element?.props?.node?.tagName;
  };

  if (element === undefined) return text;

  switch (true) {
    case getElementName(element) === "code":
      return `\`${text}\``;
    case getElementName(element) === "strong":
      return `**${text}**`;
    case getElementName(element) === "em":
      return `*${text}*`;
    case getElementName(element) === "h1":
      return `# ${text}`;
    case getElementName(element) === "h2":
      return `## ${text}`;
    case getElementName(element) === "h3":
      return `### ${text}`;
    case getElementName(element) === "h4":
      return `#### ${text}`;
    case getElementName(element) === "p":
      return text;
    case getElementName(element) === "li":
      return `- ${text}`;
    default:
      return text;
  }
};

const StatusIndicator: React.FC<{ operation: Operation }> = ({ operation }) => {
  if (operation.loading === "pending") {
    return (
      <div className="mt-4 flex items-center space-x-2">
        <span className="animate-spin h-4 w-4 border-2 border-t-transparent border-zinc-400 rounded-full"></span>
        <span className="text-sm text-zinc-400">Generating...</span>
      </div>
    );
  } else if (operation.loading === "fulfilled") {
    return (
      <div className="mt-4 text-sm text-green-400">Generation complete</div>
    );
  } else if (operation.loading === "rejected") {
    return (
      <div className="mt-4 text-sm text-red-500">Error: {operation.error}</div>
    );
  }
  return null;
};
