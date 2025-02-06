import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { modelDescriptions, type Model } from "@/config/config";
import PastedContent, { type Content } from "./PastedContent";
import ModelSelect from "../llm/ModelSelect";

const MAX_INPUT_LENGTH = 1000;

// Define interfaces for better type safety
interface ChatInputProps {
  onSubmit: (
    message: string,
    modelType: string,
    promptType: string
  ) => Promise<void>;
  isLoading?: boolean;
}

interface PromptType {
  id: string;
  name: string;
  description: string;
  placeholder: string;
}

const promptTypes: PromptType[] = [
  {
    id: "teacher",
    name: "Step-by-Step Guide",
    description: "Detailed explanations broken down into steps",
    placeholder: "Ask for a detailed explanation of any concept...",
  },
  {
    id: "interviewer",
    name: "Interview Prep",
    description: "Technical interview preparation and practice",
    placeholder: "Practice interview questions or coding challenges...",
  },
  {
    id: "concept",
    name: "Deep Dive",
    description: "Comprehensive concept exploration",
    placeholder: "Explore complex topics in detail...",
  },
  {
    id: "coding",
    name: "Code Analysis",
    description: "Code review and optimization guidance",
    placeholder: "Share code for review or ask coding questions...",
  },
];

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [selectedModel, setSelectedModel] = useState<Model>(
    modelDescriptions[0].name
  );
  const [selectedPromptType, setSelectedPromptType] =
    useState<string>("teacher");
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [pastedContents, setPastedContents] = useState<Content[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get current selections for display
  const currentModel =
    modelDescriptions.find((m) => m.name === selectedModel) ||
    modelDescriptions[0];
  const currentPrompt =
    promptTypes.find((p) => p.id === selectedPromptType) || promptTypes[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && pastedContents.length === 0) || isLoading) return;

    try {
      const fullMessage = [
        message.trim(),
        ...pastedContents.map((content) => content.text),
      ]
        .filter(Boolean)
        .join("\n\n");

      await onSubmit(fullMessage, selectedModel, selectedPromptType);
      setMessage("");
      setPastedContents([]);
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch (error) {
      console.error("Error submitting message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.length > MAX_INPUT_LENGTH) {
      e.preventDefault();
      setPastedContents((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: pastedText,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  const removePastedContent = (id: string) => {
    setPastedContents((prev) => prev.filter((content) => content.id !== id));
  };

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 border-t border-zinc-800/50 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
        <div className="relative flex flex-col gap-3">
          {/* Model and Learning Mode Selectors */}
          <div className="flex items-center justify-end gap-3">
            <ModelSelect onModelSelect={setSelectedModel} />

            {/* Learning Mode Selector */}
            <Select
              value={selectedPromptType}
              onValueChange={setSelectedPromptType}
            >
              <SelectTrigger
                className="h-9 w-[180px] bg-zinc-800/90 border-zinc-700/50 hover:bg-zinc-800 
                         text-zinc-300 hover:text-zinc-200 shadow-lg hover:shadow-xl transition-all
                         hover:border-zinc-700"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary/70" />
                  <SelectValue defaultValue={selectedPromptType}>
                    {currentPrompt.name}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent align="end" className="w-[280px]">
                <SelectGroup>
                  <SelectLabel className="text-xs font-medium text-zinc-500">
                    Learning Modes
                  </SelectLabel>
                  {promptTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="flex items-center py-2"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-zinc-300">
                          {type.name}
                        </span>
                        <span className="text-xs text-zinc-400">
                          {type.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Message Input */}
          <div
            className={`relative rounded-lg transition-all duration-200 ${
              isFocused ? "shadow-lg ring-1 ring-primary/20" : ""
            }`}
          >
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={currentPrompt.placeholder}
              className="flex-1 min-h-[56px] max-h-[200px] pr-24
                       bg-zinc-800/50 hover:bg-zinc-800/70 border-zinc-700/50
                       focus:border-primary/20 focus:ring-primary/20 resize-none
                       placeholder-zinc-500 transition-colors"
              disabled={isLoading}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {message.length > 100 && (
                <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {message.length} chars
                </span>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={
                  (!message.trim() && pastedContents.length === 0) || isLoading
                }
                className={`h-8 px-3 transition-all duration-200 ${
                  message.trim() || pastedContents.length > 0
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <PastedContent
            pastedContents={pastedContents}
            removePastedContent={removePastedContent}
          />
        </div>
      </form>
    </Card>
  );
};

export default ChatInput;
