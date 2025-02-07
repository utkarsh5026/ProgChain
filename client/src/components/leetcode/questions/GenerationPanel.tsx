import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bot, Wand2, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Syntax from "./Syntax";
import { Language, Model, models } from "@/config/config";
import { useState } from "react";
import { useProblem } from "@/store/leetcode/hook";
import ModelSelect from "@/components/llm/ModelSelect";

interface GenerationPanelProps {
  generationError: string;
  generatedCode: string;
  selectedLanguage: Language;
  closePanel: () => void;
}

const GenerationPanel: React.FC<GenerationPanelProps> = ({
  generationError,
  generatedCode,
  selectedLanguage,
  closePanel,
}) => {
  const [model, setModel] = useState<Model>(models[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const { generateSolution, problemInfo, solutionLoading } = useProblem();

  const generateCode = async () => {
    if (!problemInfo?.problem.id) return;
    closePanel();
    await generateSolution({
      model,
      additionalContext: customPrompt,
      progLang: selectedLanguage,
      problemId: problemInfo?.problem.id,
    });
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <Card className="border-dashed bg-secondary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Customize Code Generation
              </div>
              <ModelSelect onModelSelect={setModel} />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">Custom Prompt</TabsTrigger>
                <TabsTrigger value="suggestions">Quick Prompts</TabsTrigger>
              </TabsList>

              <TabsContent value="prompt" className="mt-4">
                <Textarea
                  placeholder="Describe how you want the solution to be generated..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[120px] text-base"
                />
              </TabsContent>

              <TabsContent value="suggestions" className="mt-4 space-y-3">
                {promptSuggestions.map(({ prompt, title, description }) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-4 hover:bg-secondary/50"
                    onClick={() => {
                      setCustomPrompt(prompt);
                      generateCode();
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{title}</span>
                      <span className="text-sm text-muted-foreground">
                        {description}
                      </span>
                    </div>
                  </Button>
                ))}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end items-center gap-4">
              <Button
                onClick={generateCode}
                disabled={solutionLoading}
                className="flex items-center gap-2"
              >
                {solutionLoading ? (
                  <>
                    <Bot className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>
                      {customPrompt.length > 0
                        ? "Generate"
                        : "Generate Without Prompt"}
                    </span>
                  </>
                )}
              </Button>
            </div>

            {generationError && (
              <Alert variant="destructive">
                <AlertDescription>{generationError}</AlertDescription>
              </Alert>
            )}

            {generatedCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-background">
                  <CardContent className="p-4">
                    <ScrollArea className="h-[300px]">
                      <Syntax
                        selectedLanguage={selectedLanguage}
                        generatedCode={generatedCode}
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const promptSuggestions = [
  {
    title: "Optimal Solution",
    description:
      "Generate an optimal solution with detailed comments explaining the approach",
    prompt:
      "Generate an optimal solution with time and space complexity analysis",
  },
  {
    title: "Time Complexity Focus",
    description: "Create a solution optimized for time efficiency",
    prompt: "Create a time-optimized solution with performance analysis",
  },
  {
    title: "Space Efficiency",
    description: "Write a memory-efficient implementation",
    prompt: "Implement a space-efficient solution with minimal memory usage",
  },
  {
    title: "Dynamic Programming",
    description: "Implement using dynamic programming approach",
    prompt:
      "Create a dynamic programming solution with state transition explanation",
  },
  {
    title: "Clean Code",
    description: "Generate well-documented, maintainable code",
    prompt: "Write a clean, well-documented solution following best practices",
  },
];

export default GenerationPanel;
