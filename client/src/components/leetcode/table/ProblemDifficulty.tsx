import React from "react";
import { Badge } from "@/components/ui/badge";

interface ProblemDifficultyProps {
  difficulty: string;
}

const colorMap = {
  Easy: "bg-green-500 hover:bg-green-600",
  Medium: "bg-orange-500 hover:bg-orange-600",
  Hard: "bg-red-500 hover:bg-red-600",
};

/**
 * ProblemDifficulty component for displaying the difficulty of a LeetCode problem.
 *
 * This component renders a Badge with a color corresponding to the
 * difficulty level of the problem (Easy: green, Medium: orange, Hard: red).
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.difficulty - The difficulty level of the problem
 * @returns {JSX.Element} The rendered ProblemDifficulty component
 */
const ProblemDifficulty: React.FC<ProblemDifficultyProps> = ({
  difficulty,
}) => {
  return (
    <Badge className={colorMap[difficulty as keyof typeof colorMap]}>
      {difficulty}
    </Badge>
  );
};

export default ProblemDifficulty;
