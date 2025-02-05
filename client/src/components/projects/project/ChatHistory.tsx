import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Calendar,
  Clock,
  Search,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  date: string;
  time: string;
  messageCount: number;
}

const ChatHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const chatSessions: ChatSession[] = [
    {
      id: "1",
      title: "React Hooks Discussion",
      lastMessage: "Let's explore how useEffect works in detail...",
      date: "Today",
      time: "10:30 AM",
      messageCount: 24,
    },
    {
      id: "2",
      title: "System Design Patterns",
      lastMessage: "The microservices architecture pattern is commonly used...",
      date: "Yesterday",
      time: "3:45 PM",
      messageCount: 18,
    },
    {
      id: "3",
      title: "Data Structures Practice",
      lastMessage: "Binary trees are hierarchical data structures...",
      date: "Feb 3",
      time: "11:20 AM",
      messageCount: 32,
    },
    {
      id: "4",
      title: "React Hooks Discussion",
      lastMessage: "Let's explore how useEffect works in detail...",
      date: "Today",
      time: "10:30 AM",
      messageCount: 24,
    },
  ];

  const filteredSessions = chatSessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className="w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
      from-zinc-900 via-zinc-950 to-black p-6 h-screen"
    >
      <div className="container mx-auto max-w-4xl h-full flex flex-col">
        {/* Header with search */}
        <div className="flex-none mb-8">
          <h5 className="text-xl font-semibold text-zinc-100 mb-6">
            Previous Discussions
          </h5>
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your conversations..."
              className="bg-zinc-900/50 border-zinc-800/50 pl-12 py-6 text-base
                focus:ring-primary/20 focus:border-primary/20 transition-all duration-300"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          </div>
        </div>

        {/* Collapsible Chat sessions list */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex-1">
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-zinc-200 hover:text-primary transition-colors">
            <span className="text-lg font-medium">
              {filteredSessions.length} Conversations
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4">
            <ScrollArea className="flex-1 h-[60vh]">
              <div className="space-y-4 pr-4">
                {filteredSessions.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="group hover:bg-zinc-900/50 transition-all duration-300 
                      border-zinc-800/50 backdrop-blur-xl overflow-hidden"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Session title and message count */}
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div
                                  className="absolute inset-0 bg-primary/20 rounded-full blur-xl 
                                  scale-0 group-hover:scale-150 transition-transform duration-300"
                                />
                                <MessageSquare className="w-6 h-6 text-primary relative" />
                              </div>
                              <div className="flex items-center gap-3 min-w-0">
                                <h3
                                  className="text-lg font-medium text-zinc-200 truncate
                                  group-hover:text-primary transition-colors"
                                >
                                  {session.title}
                                </h3>
                                <span
                                  className="px-2 py-1 rounded-full bg-zinc-800/50 
                                  text-xs text-zinc-400"
                                >
                                  {session.messageCount} messages
                                </span>
                              </div>
                            </div>

                            {/* Last message preview */}
                            <p
                              className="text-sm text-zinc-400 line-clamp-2 pl-10
                              group-hover:text-zinc-300 transition-colors"
                            >
                              {session.lastMessage}
                            </p>

                            {/* Date and time */}
                            <div className="flex items-center gap-4 pl-10">
                              <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                                <Calendar className="w-4 h-4" />
                                <span>{session.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                                <Clock className="w-4 h-4" />
                                <span>{session.time}</span>
                              </div>
                            </div>
                          </div>

                          {/* Continue chat button */}
                          <div className="pl-4">
                            <motion.button
                              whileHover={{ scale: 1.05, x: 3 }}
                              whileTap={{ scale: 0.95 }}
                              className="relative size-10 rounded-full flex items-center justify-center 
                                hover:bg-primary/10 transition-colors duration-300"
                            >
                              <ArrowRight
                                className="w-5 h-5 text-zinc-400 
                                group-hover:text-primary transition-colors"
                              />
                            </motion.button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ChatHistory;
