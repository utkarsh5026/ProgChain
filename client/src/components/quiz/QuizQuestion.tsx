import React, { useState } from "react";
import type { Question } from "../../store/quiz/type";
import ReactMarkdown from "react-markdown";
import { Checkbox, Radio, Space, RadioChangeEvent, Card } from "antd";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface QuizQuestionProps {
  index: number;
  question: Question;
  onAnswerChange: (questionIndex: number, answers: string[]) => void;
}

/**
 * QuizQuestion component displays a single quiz question with its difficulty level and options.
 *
 * @param {QuizQuestionProps} props - The component props
 * @param {number} props.index - Zero-based index of the question
 * @param {Object} props.question - Question object containing text, level, and other properties
 * @param {function} props.onAnswerChange - Callback function to handle answer changes
 * @returns {React.ReactElement} Rendered QuizQuestion component
 */
const QuizQuestion: React.FC<QuizQuestionProps> = ({
  index,
  question,
  onAnswerChange,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionChange = (checkedValues: string[]) => {
    setSelectedOptions(checkedValues);
    onAnswerChange(index, checkedValues);
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    const value = [e.target.value];
    setSelectedOptions(value);
    onAnswerChange(index, value);
  };

  return (
    <Card style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {`${index + 1}. ${question.text}`}
      </ReactMarkdown>
      <Space direction="vertical" style={{ width: "100%" }}>
        {question.type.toLowerCase() === "multi_correct" ? (
          <Checkbox.Group onChange={handleOptionChange} value={selectedOptions}>
            <Space direction="vertical">
              {question.answers.map((option, index) => (
                <Checkbox key={`${question.text}-${index}`} value={option}>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {option}
                  </ReactMarkdown>
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        ) : (
          <Radio.Group onChange={handleRadioChange} value={selectedOptions[0]}>
            <Space direction="vertical">
              {question.answers.map((option, index) => (
                <Radio key={`${question.text}-${index}`} value={option}>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {option}
                  </ReactMarkdown>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}
      </Space>
    </Card>
  );
};

export default QuizQuestion;
