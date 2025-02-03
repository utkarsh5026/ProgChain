import React from "react";
import { Code, BookOpen } from "lucide-react";
import type { Question } from "@/store/interview/type";
interface QuestionContentProps {
  question: Question;
}
/**  * QuestionCard Component  *  * This component displays a single interview question card.  * It shows the type of question (coding challenge or reading material)  * along with the question text itself.  *  * Props:  * - question: An object containing the details of the question.  *   - type: A string indicating the type of question (e.g., "coding-challenge" or "reading").  *   - question: A string containing the actual question text.  */ const QuestionCard: React.FC<
  QuestionContentProps
> = ({ question }) => {
  const { type, question: questionText } = question;
  return (
    <div className="space-y-6">
      {" "}
      <div className="flex items-center justify-between">
        {" "}
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          {" "}
          {type === "coding-challenge" ? (
            <Code className="h-5 w-5 text-blue-500" />
          ) : (
            <BookOpen className="h-5 w-5 text-purple-500" />
          )}{" "}
          <span className="font-medium">{type}</span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="space-y-4">
        {" "}
        <h4 className="text-lg font-semibold leading-relaxed">
          {" "}
          {questionText}{" "}
        </h4>{" "}
      </div>{" "}
    </div>
  );
};
export default QuestionCard;
