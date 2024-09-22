import React from "react";
import { Tag } from "antd";

interface ProblemDifficultyProps {
  difficulty: string;
}

const colorMap = {
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

/**
 * ProblemDifficulty component for displaying the difficulty of a LeetCode problem.
 *
 * This component renders an Ant Design Tag with a color corresponding to the
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
    <Tag color={colorMap[difficulty as keyof typeof colorMap]}>
      {difficulty}
    </Tag>
  );
};

export default ProblemDifficulty;
