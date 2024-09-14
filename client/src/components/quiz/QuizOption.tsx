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
            {answers.map((option, index) => (
              <Checkbox key={`option-${index}`} value={option}>
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
            {answers.map((option, index) => (
              <Radio key={`option-${index}`} value={option}>
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

export default QuizOptions;
