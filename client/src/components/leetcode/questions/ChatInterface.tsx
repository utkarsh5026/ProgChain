import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Bot, Send, CheckCheck } from "lucide-react";
import { type Model } from "@/config/config";
import ModelSelect from "@/components/llm/ModelSelect";

interface ChatInterfaceProps {
  itemVariants: any;
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  chat: any[];
  isTyping: boolean;
  newQuestion: string;
  setNewQuestion: (question: string) => void;
  handleSendQuestion: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  selectedModel,
  setSelectedModel,
  chat,
  isTyping,
  newQuestion,
  setNewQuestion,
  handleSendQuestion,
  itemVariants,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [chat, isTyping]);

  // Handle textarea resize and submit
  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(timestamp || Date.now()));
  };

  return (
    <motion.div variants={itemVariants} className="space-y-4">
      <Card className="h-[calc(100vh-12rem)] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-0 h-full flex flex-col">
          <div className="p-4 border-b bg-card flex items-center justify-between backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Powered by Advanced Language Models
                </p>
              </div>
            </div>
            <ModelSelect onModelSelect={setSelectedModel} />
          </div>

          {/* Enhanced Chat Messages */}
          <ScrollArea className="flex-1 px-4 py-6" ref={scrollAreaRef}>
            <AnimatePresence mode="popLayout">
              {chat.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 last:mb-2"
                >
                  <div className="flex flex-col gap-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%]">
                        <motion.div
                          className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm p-4 shadow-sm"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                        >
                          <p className="leading-relaxed">{message.question}</p>
                        </motion.div>
                        <div className="flex items-center justify-end gap-2 mt-1 px-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          <CheckCheck className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    </div>

                    {/* AI Response */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Bot className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="max-w-[80%]">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{message.model}</p>
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <motion.div
                          className="bg-card text-card-foreground rounded-2xl rounded-tl-sm p-4 shadow-sm"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                        >
                          <p className="leading-relaxed whitespace-pre-wrap">
                            {message.answer}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Enhanced Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 ml-2"
                >
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm p-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-2 h-2 bg-primary/40 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary/40 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary/40 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>

          {/* Enhanced Chat Input */}
          <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask a question... (Press Enter to send, Shift+Enter for new line)"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  className="min-h-[80px] pr-12 resize-none bg-background"
                />
                <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
                  Press Enter ↵
                </div>
              </div>
              <Button
                className="h-10 px-4 bg-primary hover:bg-primary/90"
                onClick={handleSendQuestion}
                disabled={!newQuestion.trim() || isTyping}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ChatInterface;
