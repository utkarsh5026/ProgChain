import React, { useMemo } from "react";
import { Space } from "antd";
import QuizCategoryGroup from "./QuizCategoryGroup";
import type { Question } from "../../store/quiz/type";

interface QuizContentProps {
  questions: Question[];
  onAnswerChange: (questionIndex: number, answers: string[]) => void;
}

/**
 * QuizContent component displays grouped quiz questions by category
 *
 * @param {QuizContentProps} props - The component props
 * @param {Question[]} props.questions - Array of Question objects
 * @param {Function} props.onAnswerChange - Callback function to handle answer changes
 * @returns {React.ReactElement} Rendered QuizContent component
 */
const QuizContent: React.FC<QuizContentProps> = ({
  questions,
  onAnswerChange,
}) => {
  const groupedQuestions = useMemo(() => {
    return questions.reduce((acc, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {} as Record<string, Question[]>);
  }, [questions]);

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {Object.entries(groupedQuestions).map(([category, categoryQuestions]) => (
        <QuizCategoryGroup
          key={category}
          category={category}
          questions={categoryQuestions}
          onAnswerChange={onAnswerChange}
        />
      ))}
    </Space>
  );
};

export default QuizContent;
