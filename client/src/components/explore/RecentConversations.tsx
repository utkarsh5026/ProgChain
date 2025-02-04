import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { MessageSquare, Clock, ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useExploreChats } from "@/store/explore/hook";
import LoadingAnimation from "../utils/LoadingAnimation";

const RecentConversations: React.FC = () => {
  const { chats, loading, fetchChatHistory } = useExploreChats();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetchChatHistory(10, 1);
  }, [fetchChatHistory]);

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
                  className="w-5 h-5 text-zinc-500 transition-transform duration-200"
                  style={{
                    transform: isOpen ? "rotate(0deg)" : "rotate(180deg)",
                  }}
                />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              {chats.map(({ topic, id, updatedAt }) => (
                <motion.div
                  key={id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 
                            hover:border-primary/30 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-zinc-200 font-medium">{topic}</h4>
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
                  </div>
                </motion.div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentConversations;
