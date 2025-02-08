import React, { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Send, PlusIcon } from "lucide-react";
import { type Model } from "@/config/config";
import { type PromptType } from "@/config/prompt";

import PastedContent from "./PastedContent";
import ModelSelect from "./ModelSelect";
import PromptTypeSelect from "./PromptTypeSelect";
import useChatInput from "@/store/chat-input/hook";

const MAX_INPUT_LENGTH = 1000;

interface ChatInputProps {
  onSubmit: (
    message: string,
    modelType: Model,
    promptType: PromptType,
    attachments: File[]
  ) => Promise<void>;
  isLoading?: boolean;
  extraClasses?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  isLoading = false,
  extraClasses,
}) => {
  const {
    text,
    pastedContents,
    model,
    promptType,

    setText,
    addPastedContent,
    reset,
  } = useChatInput();

  const [isFocused, setIsFocused] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (!text.trim() &&
        pastedContents.length === 0 &&
        attachedFiles.length === 0) ||
      isLoading
    )
      return;

    try {
      const fullMessage = [
        text.trim(),
        ...pastedContents.map((content) => content.content),
      ]
        .filter(Boolean)
        .join("\n\n");

      console.log("fullMessage", fullMessage, model, promptType);
      await onSubmit(fullMessage, model, promptType, attachedFiles);
      reset();
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
    setText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData("text");
    if (pastedText.length > MAX_INPUT_LENGTH) {
      e.preventDefault();
      addPastedContent(pastedText);
    }
  };

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className={` border-zinc-800/50 backdrop-blur-xl ${extraClasses}`}>
      <form onSubmit={handleSubmit} className="mx-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <Button
            type="button"
            onClick={handleFileUploadClick}
            disabled={isLoading}
            size="sm"
            className="h-8 px-2 bg-zinc-800/90 hover:bg-zinc-700"
          >
            <PlusIcon className="h-4 w-4 text-indigo-400/70" />
          </Button>

          <div className="flex items-center gap-3">
            <ModelSelect />
            <PromptTypeSelect />
          </div>
        </div>

        <div className="relative flex flex-col gap-3">
          <div
            className={`relative rounded-lg transition-all duration-200 ${
              isFocused ? "shadow-lg ring-1 ring-primary/20" : ""
            }`}
          >
            <Textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={"Type your message here..."}
              className="flex-1 min-h-[56px] max-h-[200px] pr-24
                       bg-zinc-800/50 hover:bg-zinc-800/70 border-zinc-700/50
                       focus:border-primary/20 focus:ring-primary/20 resize-none
                       placeholder-zinc-500 transition-colors"
              disabled={isLoading}
            />
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              {text.length > 100 && (
                <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {text.length} chars
                </span>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={
                  (!text.trim() &&
                    pastedContents.length === 0 &&
                    attachedFiles.length === 0) ||
                  isLoading
                }
                className={`h-8 px-3 transition-all duration-200 ${
                  text.trim() ||
                  pastedContents.length > 0 ||
                  attachedFiles.length > 0
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-zinc-700 hover:bg-zinc-600"
                }`}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <PastedContent />

          {attachedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-zinc-400 mb-2">
                Attached Files
              </h4>
              <div className="flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded"
                  >
                    <span className="text-xs text-white">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            aria-label="Upload files"
          />
        </div>
      </form>
    </Card>
  );
};

export default ChatInput;
