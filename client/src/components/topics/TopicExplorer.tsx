import React, { useRef, useState } from "react";
import { Card, List, Typography, Button, message, Spin } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

const { Title } = Typography;

interface Topic {
  emoji: string;
  topic: string;
}

interface TopicsByDifficulty {
  [key: string]: Topic[];
}

interface TopicDisplayProps {
  topic: string;
  topics: TopicsByDifficulty | null;
  isLoading: boolean;
}

const difficultyColors = {
  beginner: "#4CAF50",
  intermediate: "#2196F3",
  advanced: "#F44336",
};

const TopicDisplay: React.FC<TopicDisplayProps> = ({
  topic,
  topics,
  isLoading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const saveAsPNG = async () => {
    if (containerRef.current) {
      setIsSaving(true);
      try {
        const canvas = await html2canvas(containerRef.current, {
          backgroundColor: null,
          scale: 2, // Increase resolution
        });

        // Create a new canvas with padding for the border
        const paddedCanvas = document.createElement("canvas");
        const ctx = paddedCanvas.getContext("2d");
        const padding = 20; // Border width
        paddedCanvas.width = canvas.width + padding * 2;
        paddedCanvas.height = canvas.height + padding * 2;

        if (ctx) {
          ctx.fillStyle = "#4a4a4a";
          ctx.fillRect(0, 0, paddedCanvas.width, paddedCanvas.height);
          ctx.fillStyle = "#1f1f1f";
          ctx.fillRect(padding, padding, canvas.width, canvas.height);

          // Draw the original canvas content
          ctx.drawImage(canvas, padding, padding);

          // Add watermark
          ctx.font = "bold 24px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.translate(paddedCanvas.width / 2, paddedCanvas.height / 2);
          ctx.rotate(-Math.PI / 4);
          ctx.fillText("ProgChain", 0, 0);
        }

        const link = document.createElement("a");
        link.download = `${topic}_topics.png`;
        link.href = paddedCanvas.toDataURL();
        link.click();
        message.success("Image saved successfully!");
      } catch {
        message.error("Failed to save image");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!topics) {
    return <Title level={3}>No topics available</Title>;
  }

  return (
    <div>
      <Button
        onClick={saveAsPNG}
        style={{ marginBottom: "20px" }}
        loading={isSaving}
      >
        Save as PNG
      </Button>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          padding: "20px",
          backgroundColor: "#1f1f1f",
          borderRadius: "10px",
        }}
      >
        <Title
          level={2}
          style={{ textAlign: "center", marginBottom: "20px", color: "white" }}
        >
          {topic} Topics
        </Title>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          {Object.entries(topics).map(([difficulty, topicList], index) => (
            <motion.div
              key={difficulty}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                title={
                  <Title
                    level={4}
                    style={{
                      textTransform: "capitalize",
                      margin: 0,
                      color:
                        difficultyColors[
                          difficulty as keyof typeof difficultyColors
                        ],
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
                      difficultyColors[
                        difficulty as keyof typeof difficultyColors
                      ]
                    }`,
                  },
                  body: { padding: "12px" },
                }}
              >
                <List
                  itemLayout="horizontal"
                  dataSource={topicList}
                  renderItem={(item, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <span style={{ fontSize: "24px" }}>
                              {item.emoji}
                            </span>
                          }
                          title={
                            <span
                              style={{ fontWeight: "bold", color: "white" }}
                            >
                              {item.topic}
                            </span>
                          }
                        />
                      </List.Item>
                    </motion.div>
                  )}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Typography.Text style={{ color: "white", fontSize: "24px" }}>
              Saving...
            </Typography.Text>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TopicDisplay;
