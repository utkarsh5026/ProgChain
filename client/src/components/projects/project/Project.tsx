import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, BookOpen } from "lucide-react";
import ProjectKnowledge from "./ProjectKnowledge";
import ChatHistory from "./ChatHistory";
import ChatInput from "@/components/llm/ChatInput";
import ProjectHeader from "./ProjectHeader";

const Project: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black p-6">
      <div className="container mx-auto max-w-8xl h-[calc(100vh-3rem)]">
        <div className="flex gap-6 h-full">
          {/* Left Section - Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatInput onSubmit={() => {}} />

            {/* Chat History with Tabs */}
            <div className="flex-1 overflow-hidden mb-4">
              <Card className="bg-black/40 border-zinc-800/50 backdrop-blur-xl h-full">
                <CardContent className="p-6 h-full">
                  <Tabs defaultValue="recent" className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <TabsList className="bg-zinc-900/50 border border-zinc-800/50">
                        <TabsTrigger
                          value="recent"
                          className="data-[state=active]:bg-zinc-800/50 data-[state=active]:text-primary relative px-6"
                        >
                          <div className="flex items-center gap-2">
                            <History className="size-4" />
                            <span>Recent History</span>
                          </div>
                          {/* Active tab indicator */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 transition-transform data-[state=active]:scale-x-100" />
                        </TabsTrigger>
                        <TabsTrigger
                          value="knowledge"
                          className="data-[state=active]:bg-zinc-800/50 data-[state=active]:text-primary relative px-6"
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className="size-4" />
                            <span>Project Knowledge</span>
                          </div>
                          {/* Active tab indicator */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-0 transition-transform data-[state=active]:scale-x-100" />
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent
                      value="recent"
                      className="flex-1 mt-0 overflow-hidden"
                    >
                      <ChatHistory />
                    </TabsContent>

                    <TabsContent
                      value="knowledge"
                      className="flex-1 mt-0 space-y-4"
                    >
                      <ProjectKnowledge />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Section - Project Details and Files */}
          <div className="w-[400px] flex flex-col gap-4">
            <ProjectHeader />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
