import {
  Lightbulb,
  BarChart,
  Code2,
  Bug,
  Wrench,
  TestTube,
} from "lucide-react";

export const categoryIcons = {
  conceptual: Lightbulb,
  analytical: BarChart,
  code_comprehension: Code2,
  debugging: Bug,
  best_practices: Wrench,
  problem_solving: TestTube,
};

export type CategoryIconType = keyof typeof categoryIcons;

export const getCategoryIcon = (category: string) => {
  category = category.toLowerCase();
  return categoryIcons[category as CategoryIconType] || Lightbulb;
};
