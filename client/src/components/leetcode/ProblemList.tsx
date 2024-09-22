import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Table } from "antd";
import ProblemDifficulty from "./ProblemDifficulty";
import useProblems from "../../store/leetcode/hook";
import type { ProblemBasic } from "../../store/leetcode/type";

/**
 * ProblemList component for displaying a list of LeetCode problems.
 *
 * This component fetches and renders a table of LeetCode problems using the Ant Design Table component.
 * It includes columns for the problem name, difficulty (with filtering), and acceptance rate.
 * The component uses Framer Motion for animation effects.
 *
 * @component
 * @returns {JSX.Element} The rendered ProblemList component
 */
const ProblemList: React.FC = () => {
  const { fetchProblems, problems } = useProblems();

  useEffect(() => {
    fetchProblems({ page: 1, limit: 20 });
  }, [fetchProblems]);

  if (problems === null) return <div>Loading...</div>;

  const columns = [
    {
      title: "Problem",
      dataIndex: "problem",
      key: "problem",
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (text: string) => <ProblemDifficulty difficulty={text} />,
      filters: [
        { text: "Easy", value: "Easy" },
        { text: "Medium", value: "Medium" },
        { text: "Hard", value: "Hard" },
      ],
      onFilter: (value: boolean | React.Key, record: ProblemBasic) =>
        record.difficulty === String(value),
    },
    {
      title: "Acceptance Rate",
      dataIndex: "acceptance_rate",
      key: "acceptance_rate",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.2,
        type: "spring",
      }}
    >
      <Table
        dataSource={problems.problems}
        columns={columns.map((column) => ({
          ...column,
          onFilter: column.onFilter
            ? (value: boolean | React.Key, record: ProblemBasic) =>
                column.onFilter(String(value), record)
            : undefined,
        }))}
        pagination={false}
        size="large"
      />
    </motion.div>
  );
};

export default ProblemList;
