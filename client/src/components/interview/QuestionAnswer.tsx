import React from "react";
import { Button } from "../ui/button";
import type { Question } from "@/store/interview/type";
import {
  Loader2,
  CheckCircle2,
  Brain,
  BookOpen,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle } from "../ui/card";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import QuestionCard from "./QuestionCard";

interface QuestionAnswerProps {
  question: Question;
  answer: string;
  loading: boolean;
  handleRevealAnswer: () => void;
  moveToNextQuestion: () => void;
  moveToPreviousQuestion: () => void;
  filteredQuestions: Question[];
}

const QuestionAnswer: React.FC<QuestionAnswerProps> = ({
  question,
  answer,
  loading,
  handleRevealAnswer,
  moveToNextQuestion,
  moveToPreviousQuestion,
  filteredQuestions,
}: QuestionAnswerProps) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={moveToPreviousQuestion}
              disabled={!question || filteredQuestions.indexOf(question) === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={moveToNextQuestion}
              disabled={
                !question ||
                filteredQuestions.indexOf(question) ===
                  filteredQuestions.length - 1
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl bg-accent/5 p-6">
          <QuestionCard question={question} />
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleRevealAnswer}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : answer ? (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            ) : null}
            {answer ? "Answer Revealed" : "Show Solution"}
          </Button>

          {answer && (
            <Card className="border-none shadow-lg bg-accent/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-500" />
                  <CardTitle>Solution Explanation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ReactMarkdown
                  className="prose dark:prose-invert max-w-none"
                  rehypePlugins={[rehypeHighlight]}
                >
                  {answer}
                </ReactMarkdown>

                <div className="mt-6 space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-purple-500" />
                      Key Takeaways
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-500" />
                        <span className="text-sm">
                          Time Complexity: O(n) - Linear time solution
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          Space Complexity: O(1) - Constant space used
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">
                          Key Concept: Two-pointer technique
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Practice Tips</h3>
                    <div className="bg-accent/5 rounded-lg p-4 space-y-2">
                      <p className="text-sm">
                        Try solving this problem using different approaches:
                      </p>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Implement using a hash map for O(n) space</li>
                        <li>Try the recursive solution</li>
                        <li>Consider edge cases with empty or invalid input</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default QuestionAnswer;
