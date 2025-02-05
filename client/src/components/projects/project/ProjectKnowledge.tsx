import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, BookOpen, Files, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProjectFiles from "./ProjectFiles";

interface KnowledgeEntry {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  category: string;
}

const ProjectKnowledge: React.FC = () => {
  const [knowledgeEntries, setKnowledgeEntries] = useState<KnowledgeEntry[]>([
    {
      id: "1",
      title: "System Design Fundamentals",
      description:
        "Core concepts of distributed systems including scalability, reliability, and consistency. This covers the CAP theorem, eventual consistency, and basic architectural patterns.",
      createdAt: "2024-02-05T09:00:00Z",
      category: "Architecture",
    },
    {
      id: "2",
      title: "Load Balancing Strategies",
      description:
        "Different approaches to load balancing including round-robin, least connections, and weighted methods. Includes practical examples and trade-offs.",
      createdAt: "2024-02-05T10:00:00Z",
      category: "Infrastructure",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [newEntry, setNewEntry] = useState({
    title: "",
    description: "",
    category: "",
  });

  const handleRemoveEntry = (id: string) => {
    setKnowledgeEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const filteredEntries = knowledgeEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-gradient-to-b from-black/40 to-black/60 border-zinc-800/50 backdrop-blur-2xl overflow-hidden shadow-2xl">
      <CardContent className="p-6 h-[480px] flex flex-col">
        {/* Content Tabs */}
        <Tabs defaultValue="knowledge" className="flex-1">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-900/50">
            <TabsTrigger
              value="knowledge"
              className="data-[state=active]:bg-zinc-800/50 data-[state=active]:text-primary"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Knowledge Base
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:bg-zinc-800/50 data-[state=active]:text-primary"
            >
              <Files className="w-4 h-4 mr-2" />
              Project Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="flex-1 mt-0">
            <ScrollArea className="h-[320px] pr-4">
              <AnimatePresence mode="popLayout">
                {filteredEntries.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEntries.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/50 hover:border-zinc-700/50 group transition-all duration-300"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-zinc-200">
                                {entry.title}
                              </h3>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-zinc-800/50 text-zinc-400">
                                {entry.category}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                              {entry.description}
                            </p>
                            <p className="mt-2 text-xs text-zinc-500">
                              Added{" "}
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10 hover:text-red-400"
                            onClick={() => handleRemoveEntry(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-48 text-zinc-500"
                  >
                    <FileText className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm font-medium mb-1">
                      {searchQuery
                        ? "No entries match your search"
                        : "No knowledge entries yet"}
                    </p>
                    <p className="text-xs text-zinc-600">
                      {searchQuery
                        ? "Try a different search term"
                        : "Add your first entry to get started"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="files" className="flex-1 mt-0">
            <ProjectFiles />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectKnowledge;
