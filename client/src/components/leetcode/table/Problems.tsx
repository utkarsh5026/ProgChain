import React from "react";
import ProblemList from "./ProblemList";

const Problems: React.FC = () => {
  return (
    <div className="flex flex-col space-y-5 w-full">
      <ProblemList />
    </div>
  );
};

export default Problems;
