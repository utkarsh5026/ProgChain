import React from "react";
import ProjectCreate from "./home/ProjectCreate";
import Project from "./project/Project";

const Projects: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Project />
    </div>
  );
};

export default Projects;
