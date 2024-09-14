import React from "react";
import ReactMarkdown from "react-markdown";
import { Checkbox, Radio, Space, RadioChangeEvent } from "antd";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import useQuiz from "../../store/quiz/hook";

interface QuizOptionsProps {
  questionType: string;
  answers: string[];
  selectedOptions: number[];
  correctAnswers: number[];
  onOptionChange: (answers: number[]) => void;
}

/**
 * QuizOptions component renders a set of options for a quiz question.
 * It supports both multiple-choice and single-choice questions.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.questionType - The type of question ('multi_correct' or other)
 * @param {string[]} props.answers - Array of answer options
 * @param {number[]} props.selectedOptions - Array of indices of selected options
 * @param {number[]} props.correctAnswers - Array of indices of correct answers
 * @param {function} props.onOptionChange - Callback function when an option is selected
 * @returns {React.ReactElement} Rendered QuizOptions component
 */
const QuizOptions: React.FC<QuizOptionsProps> = ({
  questionType,
  answers,
  selectedOptions,
  correctAnswers,
  onOptionChange,
}) => {
  const { isSubmitted } = useQuiz();
  const getOptionStyle = (index: number) => {
    if (!isSubmitted) return {};

    const isSelected = selectedOptions.includes(index);
    const isCorrect = correctAnswers.includes(index);

    if (isCorrect) {
      return {
        backgroundColor: "rgba(0, 255, 0, 0.1)",
        border: "1px solid green",
        borderRadius: "10px",
      };
    } else if (isSelected) {
      return {
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        border: "1px solid red",
        borderRadius: "10px",
      };
    }
    return {};
  };

  const handleOptionChange = (checkedValues: string[]) => {
    const indices = checkedValues.map((value) => answers.indexOf(value));
    onOptionChange(indices);
  };

  const handleRadioChange = (e: RadioChangeEvent) => {
    const index = answers.indexOf(e.target.value);
    console.log("index", index);
    onOptionChange([index]);
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {questionType.toLowerCase() === "multi_correct" ? (
        <Checkbox.Group
          onChange={handleOptionChange}
          value={selectedOptions.map((option) => answers[option])}
          disabled={isSubmitted}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {answers.map((option, index) => (
              <div key={keyCreate(option)} style={getOptionStyle(index)}>
                <Checkbox
                  value={option}
                  style={{ width: "100%", padding: "8px" }}
                >
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {option}
                  </ReactMarkdown>
                </Checkbox>
              </div>
            ))}
          </Space>
        </Checkbox.Group>
      ) : (
        <Radio.Group
          onChange={handleRadioChange}
          value={
            selectedOptions.length > 0 ? answers[selectedOptions[0]] : null
          }
          disabled={isSubmitted}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            {answers.map((option, index) => (
              <div key={keyCreate(option)} style={getOptionStyle(index)}>
                <Radio value={option} style={{ width: "100%", padding: "8px" }}>
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {option}
                  </ReactMarkdown>
                </Radio>
              </div>
            ))}
          </Space>
        </Radio.Group>
      )}
    </Space>
  );
};

const keyCreate = (s: string) => `${s}-${Date.now().toPrecision()}`;

export default QuizOptions;
