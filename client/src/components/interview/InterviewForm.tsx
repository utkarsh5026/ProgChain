import React, { useState, useCallback } from "react";
import {
  Play,
  Sparkles,
  Target,
  Book,
  Lightbulb,
  GraduationCap,
  Binary,
  Code,
  BrainCircuit,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInterviewQuestions } from "@/store/interview/hooks";
import { models, type Model } from "@/config/config";
import ModelSelect from "@/components/llm/ModelSelect";
import InterviewHistory from "./InterviewHistory";

const popularTopics = [
  { name: "React", icon: Code, color: "text-blue-500" },
  { name: "System Design", icon: Binary, color: "text-green-500" },
  { name: "Data Structures", icon: BrainCircuit, color: "text-purple-500" },
  { name: "Algorithms", icon: Target, color: "text-rose-500" },
];

const formSchema = z.object({
  topic: z.string().min(1, "Please enter the interview topic"),
  instructions: z.string().optional(),
  difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  focusAreas: z.array(z.string()).optional(),
});

const InterviewGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(models[0]);
  const [activeTab, setActiveTab] = useState("quick-start");
  const { currentTopic, fetchQuestions } = useInterviewQuestions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      instructions: "",
    },
  });

  const handleModelSelect = (model: Model) => {
    setSelectedModel(model);
  };

  const handleSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setLoading(true);
      try {
        const data = {
          topic: values.topic,
          context: currentTopic ?? "",
          extraInstructions: values.instructions ?? "",
          model: selectedModel,
        };
        await fetchQuestions(data);
      } catch (error) {
        console.error("Error generating questions:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentTopic, selectedModel]
  );

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Interview Question Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create personalized technical interview questions tailored to your
            needs
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
            <TabsTrigger
              value="quick-start"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <TabsContent value="quick-start">
              <InterviewHistory history={popularTopics} />
            </TabsContent>

            <TabsContent value="custom">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Customize Your Interview
                  </CardTitle>
                  <CardDescription>
                    Tailor the questions to your specific needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handleSubmit)}
                      className="space-y-6"
                    >
                      <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interview Topic</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="e.g., React, System Design, Algorithms"
                                  className="pl-10"
                                  {...field}
                                />
                                <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Requirements</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Textarea
                                  placeholder="Specify any particular focus areas or requirements..."
                                  className="min-h-32 pl-10"
                                  {...field}
                                />
                                <Lightbulb className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-4">
                        <ModelSelect onModelSelect={handleModelSelect} />
                        <Button
                          type="submit"
                          size="lg"
                          disabled={loading}
                          className="w-full sm:w-auto"
                        >
                          {loading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="mr-2"
                            >
                              <Sparkles className="h-5 w-5" />
                            </motion.div>
                          ) : (
                            <Play className="mr-2 h-5 w-5" />
                          )}
                          Generate Questions
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewGenerator;
