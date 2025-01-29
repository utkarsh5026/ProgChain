import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { ChevronRight, BookOpen, Loader2 } from "lucide-react";
import useTopics from "../../store/topics/hook";
import TopicDisplay from "./TopicExplorer";
import { DELIMITER } from "../../store/topics/slice";
import AskTopic from "./AskTopic";

const TopicChain: React.FC = () => {
  const { currentTopic, generateConcepts, loading, topicConcepts, parseTopic } =
    useTopics();

  const pathSegments = computePathSegments(currentTopic);

  const handleSegmentClick = (index: number) => {
    const newPath = pathSegments.slice(0, index + 1).join(DELIMITER);
    const { mainTopic, context } = parseTopic(newPath);
    generateConcepts(mainTopic, context, false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (currentTopic === null) return <AskTopic />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTopic}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-full"
      >
        <Card className="min-h-[90vh] w-full border-none bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-xl">
          <CardContent className="p-6">
            <motion.div
              variants={itemVariants}
              className="bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-zinc-700/50"
            >
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-white">
                  Learning Path
                </h2>
              </div>

              <Breadcrumb className="flex flex-wrap gap-2">
                {pathSegments.map((segment, index) => (
                  <BreadcrumbItem key={segment} className="flex items-center">
                    <BreadcrumbLink
                      onClick={() => handleSegmentClick(index)}
                      className={`
                        px-3 py-1.5 rounded-md transition-all duration-200
                        ${
                          index === pathSegments.length - 1
                            ? "bg-primary/20 text-primary font-medium"
                            : "hover:bg-zinc-700/50 text-zinc-400 hover:text-white"
                        }
                      `}
                    >
                      {segment}
                    </BreadcrumbLink>
                    {index < pathSegments.length - 1 && (
                      <ChevronRight className="w-4 h-4 mx-2 text-zinc-600" />
                    )}
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            </motion.div>

            {loading ? (
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center h-64"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </motion.div>
            ) : (
              currentTopic && (
                <motion.div variants={itemVariants}>
                  <TopicDisplay
                    topic={currentTopic}
                    topics={topicConcepts[currentTopic]}
                    isLoading={loading}
                  />
                </motion.div>
              )
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Computes the path segments from a given topic string by splitting it at delimiter
 * boundaries and filtering out empty segments.
 *
 * @param {string | null} topic - The topic string to be split into segments
 * @returns {string[]} An array of cleaned path segments
 */
const computePathSegments = (topic: string | null): string[] => {
  if (!topic) return [];
  return topic.split(DELIMITER).filter(Boolean);
};

export default TopicChain;
