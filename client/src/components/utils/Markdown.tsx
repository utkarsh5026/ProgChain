import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface MarkdownProps {
  content: string;
}

const Markdown: React.FC<MarkdownProps> = ({ content }) => {
  return (
    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
  );
};

export default Markdown;
