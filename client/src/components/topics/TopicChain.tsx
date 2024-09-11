import React from "react";
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

const computePathSegments = (topic: string | null): string[] => {
  if (!topic) return [];
  return topic.split(DELIMITER).filter(Boolean);
};

const TopicChain: React.FC = () => {
  const { currentTopic, generateConcepts, loading, topicConcepts } =
    useTopics();
  const pathSegments = computePathSegments(currentTopic);

  const handleSegmentClick = (index: number) => {
    const newPath = pathSegments.slice(0, index + 1).join(DELIMITER);
    const mainTopic = pathSegments[0];
    const context = newPath.split(DELIMITER).slice(1);
    generateConcepts(mainTopic, context);
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
