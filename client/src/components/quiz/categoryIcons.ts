import {
  BulbOutlined,
  BarChartOutlined,
  CodeOutlined,
  BugOutlined,
  ToolOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";

export const categoryIcons = {
  conceptual: BulbOutlined,
  analytical: BarChartOutlined,
  code_comprehension: CodeOutlined,
  debugging: BugOutlined,
  best_practices: ToolOutlined,
  problem_solving: ExperimentOutlined,
};

export type CategoryIconType = keyof typeof categoryIcons;

export const getCategoryIcon = (category: string) => {
  return categoryIcons[category as CategoryIconType] || BulbOutlined;
};
