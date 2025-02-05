import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  File,
  FileText,
  FileCode,
  FileImage,
  FileVideo,
  FileAudio,
  FileJson,
  FileSpreadsheet,
  FileType2,
  FileArchive,
  Search,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectFile {
  id: string;
  name: string;
  uploadedAt: string;
}

const ProjectFiles: React.FC = () => {
  const [files, setFiles] = useState<ProjectFile[]>([
    {
      id: "1",
      name: "SystemDesignBasics.pdf",
      uploadedAt: "2024-02-05T09:00:00Z",
    },
    {
      id: "2",
      name: "ArchitecturePatterns.md",
      uploadedAt: "2024-02-05T09:30:00Z",
    },
    {
      id: "3",
      name: "diagram.svg",
      uploadedAt: "2024-02-05T10:00:00Z",
    },
    {
      id: "4",
      name: "code-examples.tsx",
      uploadedAt: "2024-02-05T10:30:00Z",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: ProjectFile = {
        id: Date.now().toString(),
        name: file.name,
        uploadedAt: new Date().toISOString(),
      };
      setFiles((prev) => [...prev, newFile]);
    }
  };

  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId));
  }, []);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="w-96 bg-gradient-to-b from-black/40 to-black/60 border-zinc-800/50 backdrop-blur-2xl overflow-hidden shadow-2xl">
      <CardContent className="p-6 h-[480px] flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold text-zinc-100">Files</h3>
            <p className="text-sm text-zinc-400">{files.length} total</p>
          </div>
          <Button
            size="sm"
            className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all duration-300"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add File
          </Button>
          <Input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* Search Section */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-zinc-900/50 rounded-lg blur-md" />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900/50 border-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 h-11 ring-offset-zinc-900/50 focus-visible:ring-primary/30"
            />
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-zinc-800/50 p-1 rounded-md transition-colors duration-200"
              >
                <X className="h-4 w-4 text-zinc-400 hover:text-zinc-300" />
              </Button>
            )}
          </div>
        </div>

        {/* Files List Section */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent pr-2">
          <AnimatePresence mode="popLayout">
            {filteredFiles.length > 0 ? (
              <ScrollArea className="h-full">
                {filteredFiles.map((file) => {
                  const { Icon, color, bgColor } = getFileIcon(file.name);

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="p-4 rounded-xl hover:bg-zinc-800/30 bg-zinc-900/20
                        cursor-pointer group transition-all duration-300 border border-zinc-800/50 hover:border-zinc-700/50"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="relative">
                            <div
                              className={cn(
                                "absolute inset-0 rounded-xl blur-2xl scale-0 group-hover:scale-150 transition-transform duration-500",
                                bgColor
                              )}
                            />
                            <div
                              className={cn(
                                "relative size-10 rounded-lg flex items-center justify-center",
                                "border border-zinc-800/50 group-hover:border-zinc-700/50",
                                "transition-colors duration-300",
                                bgColor
                              )}
                            >
                              <Icon className={cn("size-5", color)} />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium text-zinc-200 group-hover:text-zinc-100 transition-colors duration-300 truncate"
                              )}
                            >
                              {file.name}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              {new Date(file.uploadedAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(file.id);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </ScrollArea>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-48 text-zinc-500 bg-zinc-900/20 rounded-xl border border-zinc-800/50"
              >
                <FileText className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-sm font-medium mb-1">
                  {searchQuery
                    ? "No files match your search"
                    : "No files uploaded yet"}
                </p>
                <p className="text-xs text-zinc-600">
                  {searchQuery
                    ? "Try a different search term"
                    : "Upload your first file to get started"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

const fileTypeConfig = {
  code: [
    "js",
    "ts",
    "jsx",
    "tsx",
    "html",
    "css",
    "scss",
    "less",
    "py",
    "java",
    "cpp",
    "c",
    "cs",
    "php",
    "rb",
    "go",
    "rust",
  ] as const,
  image: ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"] as const,
  video: ["mp4", "webm", "mov", "avi", "mkv"] as const,
  audio: ["mp3", "wav", "ogg", "flac", "m4a"] as const,
  document: ["doc", "docx", "txt", "rtf", "odt"] as const,
  pdf: ["pdf"] as const,
  spreadsheet: ["xls", "xlsx", "csv", "ods"] as const,
  presentation: ["ppt", "pptx", "odp"] as const,
  archive: ["zip", "rar", "7z", "tar", "gz"] as const,
  json: ["json"] as const,
  markdown: ["md", "mdx"] as const,
} as const;

const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() ?? "";
};

const getFileIcon = (filename: string) => {
  const extension = getFileExtension(filename);

  const isType = (category: keyof typeof fileTypeConfig) => {
    const fileType = fileTypeConfig[category];
    for (const type of fileType) {
      if (type === extension) {
        return true;
      }
    }
    return false;
  };

  if (isType("code")) {
    return {
      Icon: FileCode,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/20",
    };
  }
  if (isType("image")) {
    return {
      Icon: FileImage,
      color: "text-blue-400",
      bgColor: "bg-blue-400/20",
    };
  }
  if (isType("video")) {
    return {
      Icon: FileVideo,
      color: "text-purple-400",
      bgColor: "bg-purple-400/20",
    };
  }
  if (isType("audio")) {
    return {
      Icon: FileAudio,
      color: "text-pink-400",
      bgColor: "bg-pink-400/20",
    };
  }
  if (isType("spreadsheet")) {
    return {
      Icon: FileSpreadsheet,
      color: "text-green-400",
      bgColor: "bg-green-400/20",
    };
  }
  if (isType("json")) {
    return {
      Icon: FileJson,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/20",
    };
  }
  if (isType("markdown")) {
    return {
      Icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-400/20",
    };
  }
  if (isType("archive")) {
    return {
      Icon: FileArchive,
      color: "text-orange-400",
      bgColor: "bg-orange-400/20",
    };
  }
  if (isType("document")) {
    return {
      Icon: FileType2,
      color: "text-sky-400",
      bgColor: "bg-sky-400/20",
    };
  }
  return {
    Icon: File,
    color: "text-primary",
    bgColor: "bg-primary/20",
  };
};

export default ProjectFiles;
