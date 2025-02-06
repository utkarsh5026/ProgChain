import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DnaIcon,
  Brain,
  Sparkles,
  PlusCircle,
  MessageCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PastThreads from "./PastThreads";

import ModelSelect from "@/components/llm/ModelSelect";
import PageHeader from "../utils/PageHeader";
import useThreads from "@/store/threads/hook";
import PromptTypeSelect from "../llm/PromptTypeSelect";
import LoadingButton from "../utils/LoadingButton";

import type { Model } from "@/config/config";
import { loading as loadingOp } from "@/base";

const ThreadsComponent = () => {
  const [topic, setTopic] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model>("gpt-4o-mini");

  const [isInputFocused, setIsInputFocused] = useState(false);
  const { createThread, fetchMoreContent, generating } = useThreads();
  const loading = loadingOp(generating);

  const handleFetchThreadContent = () => {
    createThread(topic, { model: selectedModel });
    fetchMoreContent({});
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen w-full p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black"
      >
        <PageHeader
          title="Learning Threads"
          description="Start a new learning journey or continue from your past threads."
          icons={[
            <DnaIcon className="w-16 h-16 text-primary" key="dna" />,
            <Brain className="w-16 h-16 text-primary/80" key="brain" />,
            <Sparkles className="w-16 h-16 text-primary/60" key="sparkles" />,
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto relative"
        >
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger
                value="new"
                className="flex items-center justify-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Thread
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Past Threads
              </TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
                <CardContent className="p-8 md:p-12">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
                      <ModelSelect onModelSelect={setSelectedModel} />
                      <PromptTypeSelect />
                    </div>
                    <div className="relative">
                      <motion.div
                        animate={
                          isInputFocused
                            ? {
                                boxShadow: [
                                  "0 0 0 0 rgba(255,255,255,0)",
                                  "0 0 20px 2px rgba(255,255,255,0.1)",
                                  "0 0 0 0 rgba(255,255,255,0)",
                                ],
                              }
                            : {}
                        }
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Input
                          className={`w-full p-6 text-lg bg-zinc-900/50 border-2 border-zinc-800 rounded-2xl 
                            placeholder:text-zinc-600 focus:ring-2 focus:ring-primary focus:border-transparent 
                            transition-all duration-300 ${
                              isInputFocused
                                ? "border-primary shadow-lg shadow-primary/20"
                                : ""
                            }`}
                          placeholder="What would you like to learn about? (e.g., React Hooks, Machine Learning, Algorithms...)"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          onFocus={() => setIsInputFocused(true)}
                          onBlur={() => setIsInputFocused(false)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !loading && topic.trim()) {
                              handleFetchThreadContent();
                            }
                          }}
                        />
                      </motion.div>

                      {/* Input decoration */}
                      <motion.div
                        animate={{
                          opacity: isInputFocused ? 1 : 0,
                          scale: isInputFocused ? 1 : 0.8,
                        }}
                        className="absolute -right-4 -top-4 w-8 h-8 bg-primary/20 rounded-full blur-xl"
                      />
                    </div>

                    <LoadingButton
                      buttonText="Start Learning Thread"
                      loadingText="Starting..."
                      loading={false}
                      onClick={handleFetchThreadContent}
                      disabled={loading || !topic.trim()}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="past">
              <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl shadow-2xl">
                <PastThreads />
              </Card>
            </TabsContent>
          </Tabs>

          {/* Card decoration */}
          <div className="absolute -z-10 inset-0 blur-3xl opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-purple-500/20 transform rotate-12" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(ThreadsComponent);
