import React, { useMemo, useState } from "react";
import { Space, Segmented } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import QuizCategoryGroup from "./QuizCategoryGroup";
import type { Question } from "../../store/quiz/type";
import { getCategoryIcon } from "./categoryIcons";
import { parseCategory } from "../../store/quiz/slice";

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

  const categories = useMemo(() => {
    return Object.keys(groupedQuestions).map((category) => ({
      label: parseCategory(category),
      value: category,
      icon: React.createElement(getCategoryIcon(category)),
    }));
  }, [groupedQuestions]);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0].value
  );

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
              onAnswerChange={onAnswerChange}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Space>
  );
};

export default QuizContent;
