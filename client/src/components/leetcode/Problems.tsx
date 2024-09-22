import React from "react";
import { Space } from "antd";
import ProblemSearch from "./ProblemSearch";
import ProblemList from "./ProblemList";

const Problems: React.FC = () => {
  return (
    <Space direction="vertical" size={20} style={{ width: "100%" }}>
      <ProblemSearch />
      <ProblemList />
    </Space>
  );
};

export default Problems;
