import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card } from "../ui/card";
interface CodeSegmentProps {
  props: any;
}

const CopiedCodeContent = ({ content }: { content: string }) => {
  return (
    <Card className="my-6 overflow-x-auto bg-zinc-950 border-zinc-800 border relative group">
      <pre>{content}</pre>
    </Card>
  );
};

const CodeSegment: React.FC<CodeSegmentProps> = ({ props }) => {
  const { toast } = useToast();
  const codeElement = props.children;
  const codeText = codeElement ? extractText(codeElement.props?.children) : "";

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
    <div className="my-6 overflow-x-auto border-zinc-800 border relative group flex flex-col gap-2 rounded-lg">
      <Button
        onClick={handleCopy}
        className="absolute right-3 top-3 px-3 py-1.5 text-xs rounded-md bg-zinc-800/80 text-zinc-300 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-zinc-700/80 cursor-pointer"
      >
        Copy
      </Button>
      <ScrollArea className="my-6 max-w-full">
        <pre
          {...props}
          className="p-6 rounded-lg font-mono text-sm font-light max-w-full"
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
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

export default CodeSegment;
