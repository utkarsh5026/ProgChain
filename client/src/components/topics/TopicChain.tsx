import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Sparkles, Map } from "lucide-react";
import useTopics from "../../store/topics/hook";
import TopicDisplay from "./TopicExplorer";
import { DELIMITER } from "../../store/topics/slice";
import AskTopic from "./AskTopic";
import LoadingAnimation from "./LoadingAnimation";
import { useToast } from "@/hooks/use-toast";

const TopicChain: React.FC = () => {
  const { toast } = useToast();
  const { currentTopic, loading, generating, topicConcepts, fetchTopics } =
    useTopics();

  const pathSegments = computePathSegments(currentTopic);
  const handleSegmentClick = (index: number) => {
    const newPath = pathSegments.slice(0, index + 1).join(DELIMITER);
    fetchTopics(newPath, "gpt-4o-mini");
  };

  useEffect(() => {
    if (!generating) {
      toast({
        title: "Success!",
        description: "Topics have been generated successfully.",
        variant: "default",
        className: "bg-green-500/10 border-green-500/20 text-green-400",
      });
    }
  }, [generating, toast]);

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
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
        <Card className="min-h-[90vh] w-full border-none bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-xl overflow-hidden relative">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.05),transparent_50%)]" />

          <CardContent className="p-8 relative z-10">
            <motion.div
              variants={itemVariants}
              className="bg-zinc-800/30 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-zinc-700/30 relative overflow-hidden shadow-lg"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Map className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">
                      Learning Journey
                    </h2>
                    <p className="text-zinc-400 text-sm">
                      Your path to mastering{" "}
                      {pathSegments[pathSegments.length - 1]}
                    </p>
                  </div>
                </div>

                <Breadcrumb className="flex flex-wrap gap-2">
                  {pathSegments.map((segment, index) => (
                    <BreadcrumbItem
                      key={segment}
                      className="flex items-center cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <BreadcrumbLink
                          onClick={() => handleSegmentClick(index)}
                          className={`
                            px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2
                            ${
                              index === pathSegments.length - 1
                                ? "bg-primary/20 text-primary font-semibold shadow-lg shadow-primary/10"
                                : "hover:bg-zinc-700/40 text-zinc-400 hover:text-white"
                            }
                          `}
                        >
                          {index === pathSegments.length - 1 && (
                            <Sparkles className="w-4 h-4" />
                          )}
                          {segment}
                        </BreadcrumbLink>
                      </motion.div>
                      {index < pathSegments.length - 1 && (
                        <ChevronRight className="w-4 h-4 mx-3 text-zinc-600" />
                      )}
                    </BreadcrumbItem>
                  ))}
                </Breadcrumb>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <LoadingAnimation topicPath={currentTopic} />
              ) : (
                currentTopic && (
                  <motion.div
                    key="content"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="relative"
                  >
                    <TopicDisplay
                      topic={currentTopic}
                      topics={topicConcepts[currentTopic]}
                      isLoading={loading}
                    />
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

const computePathSegments = (topic: string | null): string[] => {
  if (!topic) return [];
  return topic.split(DELIMITER).filter(Boolean);
};

export default TopicChain;
