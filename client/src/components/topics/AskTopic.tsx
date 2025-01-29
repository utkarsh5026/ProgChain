import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useTopics from "@/store/topics/hook";
import { SendHorizontal } from "lucide-react";

import AppTitle from "@/components/utils/AppTitile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AskTopic: React.FC = () => {
  const { generateConcepts } = useTopics();
  const [topic, setTopic] = useState<string>("");

  const handleAskQuestion = async () => {
    console.log(topic);
    generateConcepts(topic, [], false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          delay: 0.2,
          type: "spring",
        }}
        className="flex flex-col items-center justify-center max-w-800px h-full m-0 auto p-4 rounded-8px"
      >
        <AppTitle title="Go for the topic you want to learn" size={2} />
        <Input
          placeholder="What do you want to learn?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAskQuestion();
            }
          }}
        />
        <Button variant="outline" onClick={handleAskQuestion}>
          <SendHorizontal />
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AskTopic;
