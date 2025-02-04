import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "../../ui/alert";

const ProjectCreateForm: React.FC = () => {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError("Project name is required");
      return;
    }

    const formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("description", description);
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create project");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
      <CardContent className="p-8 md:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            <div className="relative">
              <div
                className={cn(
                  "relative rounded-2xl transition-all duration-300",
                  "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
                  "p-[1px] group",
                  isTyping && "from-primary/20 via-primary/30 to-primary/20"
                )}
              >
                <div className="relative bg-zinc-900/50 rounded-2xl overflow-hidden">
                  <Input
                    placeholder="Enter your project name"
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      setIsTyping(true);
                    }}
                    onBlur={() => setIsTyping(false)}
                    className={cn(
                      "w-full p-6 text-lg bg-transparent border-0",
                      "focus:ring-0 placeholder:text-zinc-500",
                      "transition-all duration-300"
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="relative">
              <Textarea
                placeholder="Describe your project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-32 bg-zinc-900/50 border-zinc-800/50 rounded-xl p-4
                          placeholder:text-zinc-500 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-zinc-800/50 rounded-xl p-8
                        bg-zinc-900/30 hover:bg-zinc-900/50 transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Upload className="h-12 w-12 text-primary/60" />
                  </motion.div>
                  <div className="text-lg text-zinc-400">
                    Drag and drop files here or click to select
                  </div>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                    }
                    className="border-primary/20 hover:bg-primary/10"
                  >
                    Select Files
                  </Button>
                </div>
              </div>

              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  {files.map((file, index) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3


                                bg-zinc-900/50 rounded-lg border border-zinc-800/50"
                    >
                      <span className="text-zinc-400 truncate">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          ×
                        </motion.div>
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-red-500/10 border-red-500/20"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 p-6 text-lg"
            >
              Create Project
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectCreateForm;
