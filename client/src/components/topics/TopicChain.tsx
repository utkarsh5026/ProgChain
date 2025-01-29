import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import useTopics from "../../store/topics/hook";
import TopicDisplay from "./TopicExplorer";
import { DELIMITER } from "../../store/topics/slice";
import AskTopic from "./AskTopic";

/**
 * TopicChain component displays a breadcrumb navigation and topic explorer for a hierarchical topic structure.
 * It uses the useTopics hook to manage topic-related state and actions.
 *
 * @component
 * @returns {React.ReactElement} The rendered TopicChain component
 */
const TopicChain: React.FC = () => {
  const { currentTopic, generateConcepts, loading, topicConcepts, parseTopic } =
    useTopics();
  const pathSegments = computePathSegments(currentTopic);

  const handleSegmentClick = (index: number) => {
    const newPath = pathSegments.slice(0, index + 1).join(DELIMITER);
    const { mainTopic, context } = parseTopic(newPath);
    generateConcepts(mainTopic, context, false);
  };

  if (currentTopic === null) return <AskTopic />;

  return (
    <Card className="h-[90vh] w-[80vw] border-none">
      <CardContent>
        <Breadcrumb className="p-4 bg-muted rounded-md mb-4">
          {pathSegments.map((segment, index) => (
            <BreadcrumbItem key={segment}>
              <BreadcrumbLink
                onClick={() => handleSegmentClick(index)}
                className="cursor-pointer hover:text-primary"
              >
                {segment}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
        {currentTopic && (
          <TopicDisplay
            topic={currentTopic}
            topics={topicConcepts[currentTopic]}
            isLoading={loading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TopicChain;

/**
 * Computes the path segments from a given topic string.
 *
 * @param {string | null} topic - The topic string to be split into segments
 * @returns {string[]} An array of path segments
 */
const computePathSegments = (topic: string | null): string[] => {
  if (!topic) return [];
  return topic.split(DELIMITER).filter(Boolean);
};
