import React from "react";
import { Card, Typography, Avatar, Space } from "antd";
import QuizQuestion from "./QuizQuestion";
import type { Question } from "../../store/quiz/type";
import { getCategoryIcon } from "./categoryIcons";

const { Title } = Typography;

interface QuizCategoryGroupProps {
  category: string;
  questions: Question[];
}

/**
 * CategoryTitle component displays the formatted category title with an icon.
 *
 * @param {Object} props - The component props
 * @param {string} props.category - The category name
 * @returns {React.ReactElement} Rendered CategoryTitle component
 */
const CategoryTitle: React.FC<{ category: string }> = ({ category }) => {
  return (
    <Space
      direction="horizontal"
      size={15}
      align="center"
      style={{ marginBottom: "2rem" }}
    >
      <Avatar icon={React.createElement(getCategoryIcon(category))} />
      <Title level={3} style={{ margin: 0 }}>
        {category}
      </Title>
    </Space>
  );
};

/**
 * QuizCategoryGroup component displays a group of quiz questions for a specific category.
 *
 * @param {QuizCategoryGroupProps} props - The component props
 * @param {string} props.category - The category name
 * @param {Question[]} props.questions - An array of questions for the category
 * @param {function} props.onAnswerChange - Callback function to handle answer changes
 * @returns {React.ReactElement} Rendered QuizCategoryGroup component
 */
const QuizCategoryGroup: React.FC<QuizCategoryGroupProps> = ({
  category,
  questions,
}) => {
  return (
    <Card style={{ marginBottom: "2rem" }} bordered={false}>
      <CategoryTitle category={category} />
      {questions.map((question, index) => (
        <QuizQuestion
          key={`${question.text}-${index}`}
          index={index}
          question={question}
        />
      ))}
    </Card>
  );
};

export default QuizCategoryGroup;
