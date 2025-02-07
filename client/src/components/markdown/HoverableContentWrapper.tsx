import React, { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp, ArrowDown, Copy } from "lucide-react";
import useChatInput from "@/store/chat-input/hook";

interface HoverableContentWrapperProps {
  children: React.ReactNode;
  content: string;
  fullContent: string;
  startIndex: number;
  endIndex: number;
}

const HoverableContentWrapper: React.FC<HoverableContentWrapperProps> = ({
  children,
  content,
  fullContent,
  startIndex,
  endIndex,
}) => {
  const [hover, setHover] = useState(false);
  const { toast } = useToast();
  const { setText } = useChatInput();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    setHover(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setHover(false);
      timerRef.current = null;
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setHover(false);
      timerRef.current = null;
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Copy content below the current element by slicing from endIndex to the end.
  const copyContentBelow = async () => {
    const textBelow = fullContent.substring(endIndex);
    try {
      await navigator.clipboard.writeText(textBelow);
      toast({
        title: "Copied content below",
        description: textBelow,
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

  // Copy content above the current element by slicing from start to startIndex.
  const copyContentAbove = async () => {
    const textAbove = fullContent.substring(0, startIndex);
    try {
      await navigator.clipboard.writeText(textAbove);
      toast({
        title: "Copied content above",
        description: textAbove,
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

  // Optionally, you can keep the function to copy the current element’s content.
  const copyCurrentContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied current content",
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

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hover && (
        <div className="absolute -top-4 right-0 flex gap-2 p-1">
          {/* 
              Down arrow – when clicked, copies all content above the current element.
              (You can swap the icons if you prefer the inverse behavior)
            */}
          <button
            onClick={copyContentBelow}
            title="Copy content below"
            className="opacity-30 hover:opacity-100"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          {/* 
              Up arrow – when clicked, copies all content below the current element.
            */}
          <button
            onClick={copyContentAbove}
            title="Copy content above"
            className="opacity-30 hover:opacity-100"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={copyCurrentContent}
            title="Copy current content"
            className="opacity-30 hover:opacity-100"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      )}
      {children}
    </div>
  );
};

export default HoverableContentWrapper;
