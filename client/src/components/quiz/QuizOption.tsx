import React from "react";
import ReactMarkdown from "react-markdown";
import { Checkbox, Radio, Space, RadioChangeEvent } from "antd";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface QuizOptionsProps {
  questionType: string;
  answers: string[];
  selectedOptions: number[];
  onOptionChange: (answers: number[]) => void;
}
/**
 * QuizOptions component renders a set of options for a quiz question.
 * It supports both multiple-choice (radio buttons) and multiple-correct (checkboxes) question types.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.questionType - The type of question ('multi_correct' or other)
 * @param {string[]} props.answers - An array of answer options
 * @param {number[]} props.selectedOptions - An array of indices of the currently selected options
 * @param {function} props.onOptionChange - Callback function to handle option changes
 * @returns {React.ReactElement} Rendered QuizOptions component
 */
const QuizOptions: React.FC<QuizOptionsProps> = ({
  questionType,
  answers,
  selectedOptions,
  onOptionChange,
}) => {
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
        >
          <Space direction="vertical">
            {answers.map((option) => (
              <Checkbox key={keyCreate(option)} value={option}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {option}
                </ReactMarkdown>
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      ) : (
        <Radio.Group
          onChange={handleRadioChange}
          value={
            selectedOptions.length > 0 ? answers[selectedOptions[0]] : null
          }
        >
          <Space direction="vertical">
            {answers.map((option) => (
              <Radio key={keyCreate(option)} value={option}>
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {option}
                </ReactMarkdown>
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
    </Space>
  );
};

const keyCreate = (s: string) => `${s}-${Date.now().toPrecision()}`;

export default QuizOptions;
