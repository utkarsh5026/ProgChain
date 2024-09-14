import React, { useMemo, useState } from "react";
import { Space, Segmented, Row, Col, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import QuizCategoryGroup from "./QuizCategoryGroup";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "../../store/quiz/type";
import { getCategoryIcon } from "./categoryIcons";
import { parseCategory } from "../../store/quiz/slice";

const StatBox = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
`;

const StatNumber = styled.span`
  margin-left: 4px;
`;

interface QuizContentProps {
  questions: Question[];
}

/**
 * QuizContent component displays grouped quiz questions by category
 *
 * @param {QuizContentProps} props - The component props
 * @param {Question[]} props.questions - Array of Question objects
 * @returns {React.ReactElement} Rendered QuizContent component
 */
const QuizContent: React.FC<QuizContentProps> = ({ questions }) => {
  const groupedQuestions = useMemo(
    () => groupQuestionsByCategory(questions),
    [questions]
  );

  const categories = useMemo(
    () => makeSegmentedOptions(groupedQuestions),
    [groupedQuestions]
  );

  const [completedCount, skippedCount, remainingCount] = useMemo(
    () => filterQuestionsByCategory(questions),
    [questions]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].value
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space size="small" align="center">
            <Tooltip title="Completed">
              <StatBox style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}>
                <CheckCircleOutlined style={{ marginRight: 4 }} />
                <StatNumber>{completedCount}</StatNumber>
              </StatBox>
            </Tooltip>
            <Tooltip title="Skipped">
              <StatBox style={{ backgroundColor: "#fff7e6", color: "#faad14" }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                <StatNumber>{skippedCount}</StatNumber>
              </StatBox>
            </Tooltip>
            <Tooltip title="Remaining">
              <StatBox style={{ backgroundColor: "#f6ffed", color: "#52c41a" }}>
                <QuestionCircleOutlined style={{ marginRight: 4 }} />
                <StatNumber>{remainingCount}</StatNumber>
              </StatBox>
            </Tooltip>
          </Space>
        </Col>
        <Col>
          <Segmented
            options={categories}
            value={selectedCategory}
            onChange={(value) => setSelectedCategory(value as string)}
          />
        </Col>
      </Row>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {groupedQuestions[selectedCategory] && (
            <QuizCategoryGroup
              category={selectedCategory}
              questions={groupedQuestions[selectedCategory]}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Space>
  );
};

/**
 * Groups questions by their category.
 * @param questions - An array of Question objects.
 * @returns An object where keys are categories and values are arrays of questions in that category.
 */
const groupQuestionsByCategory = (
  questions: Question[]
): Record<string, Question[]> => {
  return questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);
};

/**
 * Creates options for the Segmented component based on grouped questions.
 * @param groupedQuestions - An object with categories as keys and arrays of questions as values.
 * @returns An array of objects, each representing a category option for the Segmented component.
 */
const makeSegmentedOptions = (groupedQuestions: Record<string, Question[]>) => {
  return Object.keys(groupedQuestions).map((category) => ({
    label: parseCategory(category),
    value: category,
    icon: React.createElement(getCategoryIcon(category)),
  }));
};

/**
 * Filters questions by their status and returns the count of completed, skipped, and remaining questions.
 * @param questions - An array of Question objects.
 * @returns An array with the count of completed, skipped, and remaining questions.
 */
const filterQuestionsByCategory = (questions: Question[]) => {
  const completed = questions.filter((q) => q.status === "completed").length;
  const skipped = questions.filter((q) => q.status === "skip").length;
  const remaining = questions.length - completed - skipped;
  return [completed, skipped, remaining];
};

/**
 * Variants for the motion.div used to animate the content.
 */
const containerVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      ease: "easeInOut",
      stiffness: 300,
      damping: 30,
      mass: 0.5,
      duration: 0.5,
    },
  },
};

export default QuizContent;
