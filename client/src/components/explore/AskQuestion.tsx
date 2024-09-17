import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import useExplore from "../../store/explore/hook";

const { Title } = Typography;

/**
 * AskQuestion Component
 *
 * This component renders an input field for users to ask programming-related questions.
 * It uses Framer Motion for animations and Ant Design for the input field.
 *
 * @component
 * @returns {React.ReactElement} The rendered AskQuestion component
 */
const AskQuestion: React.FC = () => {
  const [inputQuestion, setInputQuestion] = useState<string>("");
  const { fetchQuestion } = useExplore();

  const handleAskQuestion = () => fetchQuestion(inputQuestion);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          delay: 0.2,
          type: "spring",
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "800px",
          height: "100%",
          margin: "0 auto",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Title
          level={2}
          style={{
            background: "linear-gradient(45deg, #2196F3, #FF4081)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Unlock Your Curiosity!
        </Title>
        <Input.Search
          placeholder="Ask a question"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          onPressEnter={handleAskQuestion}
          onSearch={handleAskQuestion}
          enterButton={<SendOutlined />}
          size="large"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default AskQuestion;
