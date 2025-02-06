import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy, PlayIcon } from "lucide-react";

interface HoverableContentWrapperProps {
  children: React.ReactNode;
  content: string;
  onTransfer?: (text: string) => void;
}

const HoverableContentWrapper: React.FC<HoverableContentWrapperProps> = ({
  children,
  content,
  onTransfer,
}) => {
  const [hover, setHover] = useState(false);
  const { toast } = useToast();

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: content,
        duration: 500,
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
        duration: 500,
      });
    }
  };

  const transferContent = () => {
    if (onTransfer) {
      onTransfer(content);
    } else {
      // Placeholder: Insert the logic to put `content` into the chat box input
      console.log("Transferred to chat:", content);
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {hover && (
        <div className="absolute -top-4 right-0 flex gap-2 p-1">
          <button onClick={copyContent} title="Copy">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={transferContent} title="Send to chat">
            <PlayIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

export default HoverableContentWrapper;
