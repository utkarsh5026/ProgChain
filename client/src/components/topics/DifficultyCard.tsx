import React from "react";
import { Card, List, Typography } from "antd";
import { motion } from "framer-motion";
import { Concept } from "../../store/topics/types";

const { Title } = Typography;

interface DifficultyCardProps {
  difficulty: string;
  conceptList: Concept[];
  onConceptClick: (concept: Concept) => void;
}

const difficultyColors = {
  beginner: "#4CAF50",
  intermediate: "#2196F3",
  advanced: "#F44336",
};

const DifficultyCard: React.FC<DifficultyCardProps> = ({
  difficulty,
  conceptList,
  onConceptClick,
}) => {
  return (
    <Card
      title={
        <Title
          level={4}
          style={{
            textTransform: "capitalize",
            margin: 0,
            color:
              difficultyColors[difficulty as keyof typeof difficultyColors],
          }}
        >
          {difficulty}
        </Title>
      }
      style={{
        width: 300,
        backgroundColor: "#2a2a2a",
        color: "white",
      }}
      styles={{
        header: {
          backgroundColor: "#333333",
          borderBottom: `2px solid ${
            difficultyColors[difficulty as keyof typeof difficultyColors]
          }`,
        },
        body: { padding: "12px" },
      }}
    >
      <List
        itemLayout="horizontal"
        dataSource={conceptList}
        renderItem={(item: Concept, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <List.Item
              onClick={() => onConceptClick(item)}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: "20px" }}>{item.emoji}</span>}
                title={<span style={{ color: "white" }}>{item.topic}</span>}
              />
            </List.Item>
          </motion.div>
        )}
      />
    </Card>
  );
};

export default DifficultyCard;
