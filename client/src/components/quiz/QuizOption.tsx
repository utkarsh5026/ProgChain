import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import useQuiz from "../../store/quiz/hook";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
    if (!isSubmitted) return "";

    const isSelected = selectedOptions.includes(index);
    const isCorrect = correctAnswers.includes(index);

    if (isCorrect) {
      return "bg-green-50 border border-green-500 rounded-lg";
    } else if (isSelected) {
      return "bg-red-50 border border-red-500 rounded-lg";
    }
    return "";
  };

  const handleCheckboxChange = (checked: boolean, index: number) => {
    const newSelected = checked
      ? [...selectedOptions, index]
      : selectedOptions.filter((i) => i !== index);
    onOptionChange(newSelected);
  };

  const handleRadioChange = (value: string) => {
    const index = answers.indexOf(value);
    onOptionChange([index]);
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {questionType.toLowerCase() === "multi_correct" ? (
        <div className="flex flex-col space-y-3">
          {answers.map((option, index) => (
            <div
              key={keyCreate(option)}
              className={`p-2 ${getOptionStyle(index)}`}
            >
              <div className="flex items-start space-x-3">
                <Checkbox
                  id={`checkbox-${index}`}
                  checked={selectedOptions.includes(index)}
                  disabled={isSubmitted}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(checked as boolean, index)
                  }
                />
                <Label
                  htmlFor={`checkbox-${index}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {option}
                  </ReactMarkdown>
                </Label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <RadioGroup
          disabled={isSubmitted}
          value={selectedOptions.length > 0 ? answers[selectedOptions[0]] : ""}
          onValueChange={handleRadioChange}
          className="flex flex-col space-y-3"
        >
          {answers.map((option, index) => (
            <div
              key={keyCreate(option)}
              className={`p-2 ${getOptionStyle(index)}`}
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value={option} id={`radio-${index}`} />
                <Label
                  htmlFor={`radio-${index}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {option}
                  </ReactMarkdown>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

const keyCreate = (s: string) => `${s}-${Date.now().toPrecision()}`;

export default QuizOptions;
