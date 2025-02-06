import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useThreads from "@/store/threads/hook";

interface Thread {
  id: number;
  topic: string;
  contents_cnt: number;
}

const PastThreads: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { fetchThread } = useThreads();

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch("http://localhost:8000/threads/");
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  const filteredThreads = threads.filter((thread) =>
    thread.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      <div className="space-y-3">
        {filteredThreads.map((thread) => (
          <motion.div
            key={thread.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className="p-4 hover:bg-zinc-900/50 transition-all duration-200 border border-zinc-800/50 group cursor-pointer"
              onClick={() => fetchThread(thread.id)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-zinc-100 font-medium group-hover:text-white transition-colors">
                  {thread.topic}
                </h3>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  <span>{thread.contents_cnt}</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {filteredThreads.length === 0 && (
          <div className="text-center py-12 text-zinc-400">
            <MessageCircle className="w-6 h-6 mx-auto mb-2" />
            <p>No topics found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastThreads;
