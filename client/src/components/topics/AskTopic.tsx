import React, { useState } from "react";
import useTopics from "@/store/topics/hook";
import { SendHorizontal, BookOpen, Brain, Loader2 } from "lucide-react";
import AppTitle from "@/components/utils/AppTitile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AskTopic: React.FC = () => {
  const { generateConcepts } = useTopics();
  const [topic, setTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    try {
      generateConcepts(topic, [], false);
    } finally {
      console.log("done");
    }
  };

  const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 },
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center  p-4">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="flex items-center space-x-2 text-primary">
              <Brain className="w-8 h-8" />
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="text-center space-y-4">
              <AppTitle title="Master Your Interview Topics" size={2} />
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Enter any programming concept you'd like to learn for your
                interview
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="relative">
                <Input
                  className="w-full p-6 text-lg bg-white dark:bg-slate-900 border-2 focus:ring-2 focus:ring-primary"
                  placeholder="e.g., React Hooks, System Design, Data Structures..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !isLoading) {
                      handleAskQuestion();
                    }
                  }}
                />
              </div>

              <Button
                variant="default"
                size="lg"
                className="w-full py-6 text-lg font-semibold flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 transition-colors"
                onClick={handleAskQuestion}
                disabled={isLoading || !topic.trim()}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Generate Learning Path</span>
                    <SendHorizontal className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AskTopic;
