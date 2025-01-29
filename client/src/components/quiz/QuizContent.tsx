import React, { useMemo, useState } from "react";
import { CheckCircle, Clock, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Question } from "../../store/quiz/type";
import { getCategoryIcon } from "./categoryIcons";
import { parseCategory } from "../../store/quiz/slice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import QuizCategoryGroup from "./QuizCategoryGroup";

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
    <div className="flex flex-col space-y-6 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center px-2 py-1 rounded-xl bg-blue-50 text-blue-500 font-semibold text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>{completedCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Completed</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center px-2 py-1 rounded-xl bg-amber-50 text-amber-500 font-semibold text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{skippedCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Skipped</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center px-2 py-1 rounded-xl bg-green-50 text-green-500 font-semibold text-sm">
                  <HelpCircle className="w-4 h-4 mr-1" />
                  <span>{remainingCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Remaining</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger
                key={category.value}
                value={category.value}
                className="flex items-center gap-2"
              >
                {React.createElement(getCategoryIcon(category.value))}
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
    </div>
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
