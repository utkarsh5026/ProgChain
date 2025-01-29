import React from "react";
import ReactMarkdown from "react-markdown";
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
} from "lucide-react";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useQuizQuestion } from "../../store/quiz/hook";
import type { Question, CompletionStatus } from "../../store/quiz/type";
import QuizOptions from "./QuizOption";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface QuizQuestionProps {
  index: number;
  question: Question;
}

const statusColors: Record<CompletionStatus, string> = {
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  not_started: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  left_for_review: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  skip: "bg-blue-100 text-blue-800 hover:bg-blue-200",
};

const statusBorders: Record<CompletionStatus, string> = {
  completed: "border-r-green-500",
  not_started: "border-r-gray-500",
  left_for_review: "border-r-yellow-500",
  skip: "border-r-blue-500",
};

/**
 * QuizQuestion component displays a single quiz question with its difficulty level and options.
 *
 * @param {QuizQuestionProps} props - The component props
 * @param {number} props.index - Zero-based index of the question
 * @param {Object} props.question - Question object containing text, level, and other properties
 * @param {function} props.onAnswerChange - Callback function to handle answer changes
 * @returns {React.ReactElement} Rendered QuizQuestion component
 */
const QuizQuestion: React.FC<QuizQuestionProps> = ({ index, question }) => {
  const { changeQuestionStatus, changeSelectedOptions } = useQuizQuestion();
  const {
    id: questionId,
    type: questionType,
    answers,
    selectedOptions,
    correctAnswers,
  } = question;

  const handleOptionChange = (answers: number[]) => {
    changeSelectedOptions(answers, questionId);
  };

  const menuItems = [
    {
      key: "completed",
      label: "Mark as Completed",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: () => changeQuestionStatus("completed", questionId),
    },
    {
      key: "not_started",
      label: "Mark as Not Started",
      icon: <XCircle className="h-4 w-4" />,
      onClick: () => changeQuestionStatus("not_started", questionId),
    },
    {
      key: "left_for_review",
      label: "Left for Review",
      icon: <AlertCircle className="h-4 w-4" />,
      onClick: () => changeQuestionStatus("left_for_review", questionId),
    },
    {
      key: "skip",
      label: "Skip",
      icon: <PlayCircle className="h-4 w-4" />,
      onClick: () => changeQuestionStatus("skip", questionId),
    },
  ];

  return (
    <Card className={`mb-4 border-r-4 ${statusBorders[question.status]}`}>
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="secondary" className={statusColors[question.status]}>
            {question.status.replace("_", " ")}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {menuItems.map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onClick={item.onClick}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-lg">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {`${index + 1}. ${question.text}`}
          </ReactMarkdown>
        </div>

        <div className="mt-4">
          <QuizOptions
            correctAnswers={correctAnswers}
            questionType={questionType}
            answers={answers}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
          />
        </div>
      </div>
    </Card>
  );
};

export default QuizQuestion;
