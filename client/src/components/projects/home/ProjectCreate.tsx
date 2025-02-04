import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, FileCode, Files, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/utils/PageHeader";
import ProjectCreateForm from "./ProjectCreateForm";
import ProjectList from "./ProjectList";

const ProjectCreate: React.FC = () => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen w-full p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
          from-zinc-900 via-zinc-950 to-black rounded-lg"
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br
              from-primary/20 to-indigo-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
              rotate: [45, 0, 45],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br
              from-purple-500/20 to-primary/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative container mx-auto max-w-4xl">
          <motion.div variants={itemVariants} className="relative space-y-6">
            <PageHeader
              title="Projects"
              description="Manage your projects and create new ones to get personalized interview preparation"
              icons={[
                <FolderPlus className="w-14 h-14 text-primary" key="folder" />,
                <FileCode className="w-14 h-14 text-primary/80" key="file" />,
                <Files className="w-14 h-14 text-primary/60" key="files" />,
              ]}
            />

            <Tabs
              defaultValue="projects"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-xl">
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    All Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="create"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    Create New
                  </TabsTrigger>
                </TabsList>

                <Button
                  onClick={() => setActiveTab("create")}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent
                  value="projects"
                  className="border-none p-0 outline-none"
                >
                  <ProjectList />
                </TabsContent>

                <TabsContent
                  value="create"
                  className="border-none p-0 outline-none"
                >
                  <ProjectCreateForm />
                </TabsContent>
              </motion.div>
            </Tabs>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default ProjectCreate;
