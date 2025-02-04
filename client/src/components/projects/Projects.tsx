import React from "react";
import ProjectCreate from "./home/ProjectCreate";

const Projects: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <ProjectCreate />
    </div>
  );
};

export default Projects;
