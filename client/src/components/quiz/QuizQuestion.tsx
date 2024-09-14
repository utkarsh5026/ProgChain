import React from "react";
import ReactMarkdown from "react-markdown";
import { Space, Card, Dropdown, Tag } from "antd";
import {
  MoreOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  PlayCircleFilled,
} from "@ant-design/icons";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useQuizQuestion } from "../../store/quiz/hook";
import type { Question, CompletionStatus } from "../../store/quiz/type";
import QuizOptions from "./QuizOption";
interface QuizQuestionProps {
  index: number;
  question: Question;
}

const statusColors: Record<CompletionStatus, string> = {
  completed: "#4CAF50",
  not_started: "#9E9E9E",
  left_for_review: "#FFC107",
  skip: "#2196F3",
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

  const items = [
    {
      key: "completed",
      label: "Mark as Completed",
      icon: <CheckCircleFilled />,
      onClick: () => changeQuestionStatus("completed", questionId),
    },
    {
      key: "not_started",
      label: "Mark as Not Started",
      icon: <CloseCircleFilled />,
      onClick: () => changeQuestionStatus("not_started", questionId),
    },
    {
      key: "left_for_review",
      label: "Left for Review",
      icon: <ExclamationCircleFilled />,
      onClick: () => changeQuestionStatus("left_for_review", questionId),
    },
    {
      key: "skip",
      label: "Skip",
      icon: <PlayCircleFilled />,
      onClick: () => changeQuestionStatus("skip", questionId),
    },
  ];

  return (
    <Card
      style={{
        marginBottom: "1rem",
        fontSize: "1.2rem",
        borderRight: `5px solid ${statusColors[question.status]}`,
      }}
      extra={
        <div>
          <Tag color={statusColors[question.status]}>
            {question.status.replace("_", " ")}
          </Tag>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <MoreOutlined style={{ fontSize: "20px" }} />
          </Dropdown>
        </div>
      }
    >
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {`${index + 1}. ${question.text}`}
      </ReactMarkdown>
      <Space direction="vertical" style={{ width: "100%" }}>
        <QuizOptions
          correctAnswers={correctAnswers}
          questionType={questionType}
          answers={answers}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
        />
      </Space>
    </Card>
  );
};

export default QuizQuestion;
