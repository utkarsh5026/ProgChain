import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { MessageSquare, Clock, ChevronDown, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import useExploreChats from "@/store/explore/hooks/use-explore-chats";
import LoadingAnimation from "@/components/utils/LoadingAnimation";
import { useToast } from "@/hooks/use-toast";
import useExplore from "@/store/explore/hooks/use-explore";

const RecentConversations: React.FC = () => {
  const { chats, loading, fetchChatHistory, deleteChat } = useExploreChats();
  const { loadChat } = useExplore();
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchChatHistory(10, 1);
  }, [fetchChatHistory]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const chatTopic = chats.find((chat) => chat.id === id)?.topic;
    await deleteChat(id);
    toast({
      title: "Chat deleted",
      description: `The chat "${chatTopic}" has been deleted`,
    });
  };

  if (loading) {
    return <LoadingAnimation message="Loading chat history..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-6">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="text-lg font-semibold text-zinc-200 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Recent Conversations
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-3">
                {chats.map(({ topic, id, updatedAt }) => (
                  <motion.div
                    key={id}
                    whileHover={{ scale: 1.01 }}
                    onClick={() => loadChat(id)}
                    className="group relative p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 
                             hover:border-primary/30 hover:bg-zinc-900/70 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-8">
                        <h4 className="text-zinc-200 font-medium line-clamp-1">
                          {topic}
                        </h4>
                        <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
                          <Clock className="w-3 h-3" />
                          {new Date(updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(id, e)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-200 p-2 rounded-full
                                 hover:bg-red-500/10 text-zinc-400 hover:text-red-400"
                        aria-label="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentConversations;
