import React, { useEffect } from "react";
import { Breadcrumb, Card } from "antd";
import styled from "styled-components";
import useTopics from "../../store/topics/hook";
import TopicDisplay from "./TopicExplorer";
import { DELIMITER } from "../../store/topics/slice";
const StyledBreadcrumb = styled(Breadcrumb)`
  padding: 16px;
  background-color: #f0f2f5;
  border-radius: 4px;
  margin-bottom: 16px;
`;

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

  useEffect(() => {
    if (currentTopic) {
      const { mainTopic, context } = parseTopic(currentTopic);
      generateConcepts(mainTopic, context, false);
    }
  }, []);

  const handleSegmentClick = (index: number) => {
    const newPath = pathSegments.slice(0, index + 1).join(DELIMITER);
    const { mainTopic, context } = parseTopic(newPath);
    generateConcepts(mainTopic, context, false);
  };

  return (
    <Card style={{ height: "90vh", width: "80vw" }} bordered={false}>
      <StyledBreadcrumb separator=">">
        {pathSegments.map((segment, index) => (
          <Breadcrumb.Item
            key={segment}
            onClick={() => handleSegmentClick(index)}
          >
            {segment}
          </Breadcrumb.Item>
        ))}
      </StyledBreadcrumb>
      {currentTopic && (
        <TopicDisplay
          topic={currentTopic}
          topics={topicConcepts[currentTopic]}
          isLoading={loading}
        />
      )}
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
