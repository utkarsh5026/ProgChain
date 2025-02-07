import React, { useState, useMemo } from "react";
import { Brain, CheckCircle2, BookOpen, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import QuestionCard from "@/components/interview/QuestionCard";
import type {
  Question,
  DifficultyMap,
  Difficulty,
} from "@/store/interview/type";
import { getInterviewAnswer } from "@/store/interview/api";
import InterviewHeader from "@/components/interview/InterviewHeader";
import QuestionAnswer from "./QuestionAnswer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

interface Props {
  questions: DifficultyMap;
}

const InterviewPracticeComponent: React.FC<Props> = ({ questions }) => {
  // State for handling model and instructions
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [customInstructions, setCustomInstructions] = useState("");

  // State for question selection and viewing
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("Beginner");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  // Get all categories for the current difficulty level
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    const questionGroup = questions.get(selectedDifficulty) || [];
    questionGroup.forEach((question) => {
      categorySet.add(question.type);
    });
    return ["all", ...Array.from(categorySet)];
  }, [questions, selectedDifficulty]);

  // Filter questions based on selected category within the current difficulty
  const filteredQuestions = useMemo(() => {
    const questionGroup = questions.get(selectedDifficulty) || [];
    return selectedCategory === "all"
      ? questionGroup
      : questionGroup.filter((q) => q.type === selectedCategory);
  }, [questions, selectedDifficulty, selectedCategory]);

  const handleRevealAnswer = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    try {
      const fetchedAnswer = await getInterviewAnswer(selectedQuestion.question);
      setAnswer(fetchedAnswer.answer);
    } catch (error) {
      console.error("Failed to fetch answer:", error);
    } finally {
      setLoading(false);
    }
  };

  const moveToNextQuestion = () => {
    if (!selectedQuestion) return;
    const currentIndex = filteredQuestions.findIndex(
      (q) => q.id === selectedQuestion.id
    );
    if (currentIndex < filteredQuestions.length - 1) {
      setSelectedQuestion(filteredQuestions[currentIndex + 1]);
      setAnswer(null);
    }
  };

  const moveToPreviousQuestion = () => {
    if (!selectedQuestion) return;
    const currentIndex = filteredQuestions.findIndex(
      (q) => q.id === selectedQuestion.id
    );
    if (currentIndex > 0) {
      setSelectedQuestion(filteredQuestions[currentIndex - 1]);
      setAnswer(null);
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "from-green-500/20 to-green-500/10";
      case "Intermediate":
        return "from-blue-500/20 to-blue-500/10";
      case "Advanced":
        return "from-purple-500/20 to-purple-500/10";
    }
  };

  return (
    <div className="container max-w-full mx-auto px-6 space-y-8">
      <InterviewHeader
        onModelSelect={setSelectedModel}
        onInstructionsChange={setCustomInstructions}
      />

      <div className="space-y-6">
        <Tabs
          defaultValue="Beginner"
          className="w-full"
          onValueChange={(value) => {
            setSelectedDifficulty(value as Difficulty);
            setSelectedQuestion(null);
            setAnswer(null);
          }}
        >
          <TabsList className="w-full justify-start">
            {Array.from(questions.keys()).map((difficulty) => (
              <TabsTrigger
                key={difficulty}
                value={difficulty}
                className="min-w-fit"
              >
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>{difficulty}</span>
                  <Badge variant="secondary" className="ml-2">
                    {questions.get(difficulty)?.length || 0}
                  </Badge>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {Array.from(questions.keys()).map((difficulty) => (
            <TabsContent key={difficulty} value={difficulty} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-40rem)]">
                {/* Left panel - Questions list */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            <span className="capitalize">{category}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge variant="outline">
                      {filteredQuestions.length} questions
                    </Badge>
                  </div>

                  <Card
                    className={`bg-gradient-to-br ${getDifficultyColor(
                      difficulty as Difficulty
                    )}`}
                  >
                    <CardContent className="pt-6">
                      <ScrollArea className="h-[500px] pr-4">
                        {filteredQuestions.map((question) => (
                          <div
                            key={question.id}
                            onClick={() => {
                              setSelectedQuestion(question);
                              setAnswer(null);
                            }}
                            className={`mb-4 rounded-lg p-4 transition-colors cursor-pointer
                              ${
                                selectedQuestion?.id === question.id
                                  ? "bg-primary/10 border border-primary/20"
                                  : "bg-background/80 hover:bg-background/90 border border-transparent"
                              }`}
                          >
                            <QuestionCard question={question} />
                          </div>
                        ))}
                        {filteredQuestions.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <BookOpen className="h-8 w-8 mb-2" />
                            <p>No questions found in this category</p>
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                {/* Right panel - Question detail and answer */}
                <div className="rounded-lg border">
                  {selectedQuestion ? (
                    <QuestionAnswer
                      question={selectedQuestion}
                      answer={answer ?? ""}
                      loading={loading}
                      handleRevealAnswer={handleRevealAnswer}
                      moveToNextQuestion={moveToNextQuestion}
                      moveToPreviousQuestion={moveToPreviousQuestion}
                      filteredQuestions={filteredQuestions}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-2">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-muted-foreground">
                          Select a question to begin practicing
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewPracticeComponent;
