import React, { useState } from "react";
import { Typography, Divider, Button, Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import QuestionCard from "./QuestionCard";
import { motion } from "framer-motion";
import type { Question } from "../../store/interview/type";
import { useInterviewQuestions } from "../../store/interview/hooks";

const { Title, Paragraph } = Typography;

const ProgrammingQAComponent: React.FC = () => {
  const { questions, fetchQuestions } = useInterviewQuestions();
  const [loading, setLoading] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");

  const handleGenerateQuestions = async () => {
    setLoading(true);
    try {
      const data = {
        topic: "python",
        context: "python",
        extraInstructions: customInstructions,
      };
      await fetchQuestions(data); // Implement this function in your API
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadingIcon = (
    <LoadingOutlined style={{ fontSize: 24, color: "#1890ff" }} spin />
  );

  return (
    <div
      style={{
        margin: "0 auto",
        padding: 24,
        width: "80vw",
      }}
    >
      <Title level={2}>Programming Q&A</Title>
      <Paragraph>
        This component displays a series of programming questions. Click
        'Generate Questions' to fetch new questions.
      </Paragraph>
      <Input
        placeholder="Add custom instructions (optional)"
        value={customInstructions}
        onChange={(e) => setCustomInstructions(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Button
        type="primary"
        onClick={handleGenerateQuestions}
        disabled={loading}
        style={{ marginBottom: 16 }}
      >
        Generate Questions
      </Button>
      <Divider />
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Spin indicator={loadingIcon} />
        </motion.div>
      ) : (
        questions.map((question, index) => (
          <QuestionCard key={index} question={question} index={index} />
        ))
      )}
    </div>
  );
};

export default ProgrammingQAComponent;
