import React, { useState, useRef } from "react";
import { Plus, Send, X, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface SelectedFile {
  id: string;
  name: string;
}

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
    }));
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFiles.length > 0) {
      console.log("Sending message:", message);
      console.log("With files:", selectedFiles);
      setMessage("");
      setSelectedFiles([]);
    }
  };

  return (
    <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl mb-4">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selected Files Display */}
          <AnimatePresence mode="popLayout">
            {selectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {selectedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="group flex items-center gap-2 bg-zinc-800/50 text-zinc-300 px-3 py-1.5 rounded-lg
                      border border-zinc-700/50"
                  >
                    <Paperclip className="size-3.5 text-zinc-400" />
                    <span className="text-sm truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className="text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-0 bg-zinc-900/50 rounded-lg blur-md" />
              <div className="relative">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="bg-zinc-900/50 border-zinc-800/50 text-zinc-200 
                    placeholder:text-zinc-500 pr-24 h-12 ring-offset-zinc-900/50 
                    focus-visible:ring-primary/30"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {/* File Selection Button */}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8 hover:bg-zinc-800/50 transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="size-4 text-zinc-400" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />

                  {/* Send Button */}
                  <Button
                    type="submit"
                    size="icon"
                    className="size-8 bg-primary/10 hover:bg-primary/20 text-primary 
                      border border-primary/20 shadow-lg shadow-primary/10 
                      hover:shadow-primary/20 transition-all duration-300"
                    disabled={!message.trim() && selectedFiles.length === 0}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatInput;
