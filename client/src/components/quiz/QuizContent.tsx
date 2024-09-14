import React, { useMemo, useState } from "react";
import { Space, Segmented } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import QuizCategoryGroup from "./QuizCategoryGroup";
import type { Question } from "../../store/quiz/type";
import { getCategoryIcon } from "./categoryIcons";
import { parseCategory } from "../../store/quiz/slice";

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

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].value
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "16px",
        }}
      >
        <Segmented
          options={categories}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value as string)}
        />
      </div>

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
