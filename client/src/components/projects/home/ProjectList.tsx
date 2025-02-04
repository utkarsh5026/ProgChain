import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const ProjectList: React.FC = () => {
  const projects: Project[] = [
    {
      id: "1",
      name: "React Interview Prep",
      description:
        "Frontend interview preparation materials and practice problems",
      createdAt: "2024-02-05",
    },
    {
      id: "2",
      name: "System Design Notes",
      description:
        "Collection of system design patterns and architecture examples",
      createdAt: "2024-02-04",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card className="group overflow-hidden border-zinc-800/50 backdrop-blur-xl">
              <div
                className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 
                group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500"
              />

              <CardContent className="p-6 relative">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="space-y-1">
                      <h3
                        className="text-lg font-medium text-zinc-200 group-hover:text-white 
                        transition-colors duration-300 relative inline-block"
                      >
                        {project.name}
                        <div
                          className="absolute inset-x-0 h-px bottom-0 bg-gradient-to-r 
                          from-primary/0 via-primary to-primary/0 scale-x-0 
                          group-hover:scale-x-100 transition-transform duration-500 
                          origin-center"
                        />
                      </h3>
                      <p
                        className="text-sm text-zinc-500 group-hover:text-zinc-400 
                        transition-colors duration-300"
                      >
                        Created {project.createdAt}
                      </p>
                    </div>

                    <p
                      className="text-sm text-zinc-400 line-clamp-2 
                      group-hover:text-zinc-300 transition-colors duration-300
                      pr-4"
                    >
                      {project.description}
                    </p>
                  </div>

                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05, x: 3 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative size-8 rounded-full 
                        flex items-center justify-center group/button"
                    >
                      <div
                        className="absolute inset-0 bg-primary/0 rounded-full 
                        group-hover/button:bg-primary/10 transition-colors duration-300"
                      />

                      <div className="relative">
                        <ArrowRight
                          className="size-4 text-zinc-400 
                          group-hover:text-primary transition-colors duration-300"
                        />
                      </div>

                      <div
                        className="absolute inset-0 rounded-full opacity-0 
                        group-hover/button:opacity-100 transition-opacity duration-300
                        bg-primary/20 blur-md -z-10"
                      />
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r 
                    from-transparent via-zinc-700/50 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
