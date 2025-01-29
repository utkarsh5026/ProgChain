import React, { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Collapse,
  Space,
  Tag,
  message,
  Divider,
} from "antd";
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CodeOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import type { Difficulty, Question } from "../../store/interview/type";
import { getInterviewAnswer } from "../../store/interview/api";

const { Text, Paragraph, Title } = Typography;
const { Panel } = Collapse;

const ParticleContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100px;
  overflow: hidden;
  margin-bottom: 16px;
`;

const Particle = styled(motion.div)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1890ff, #36cfc9);
`;

const difficultyColors: Record<Difficulty, string> = {
  easy: "#52c41a",
  medium: "#faad14",
  hard: "#f5222d",
};

interface QuestionContentProps {
  question: Question;
}

interface QuestionCardProps {
  question: Question;
  index: number;
}

interface AnswerCardProps {
  answer: string;
}

const QuestionContent: React.FC<QuestionContentProps> = ({ question }) => {
  const { type, question: questionText } = question;
  switch (type) {
    case "multiple-choice":
      return (
        <div>
          <Title level={4}>{questionText}</Title>
          <ul>
            {question.options?.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      );
    case "coding-challenge":
      return (
        <div>
          <Paragraph>
            <CodeOutlined /> Coding Challenge
          </Paragraph>
          <Title level={4}>{questionText}</Title>
        </div>
      );
    case "open-ended":
    case "scenario-based":
    default:
      return <Title level={4}>{questionText}</Title>;
  }
};

const AnswerCard: React.FC<AnswerCardProps> = ({ answer }) => {
  return (
    <Card
      title={<Title level={4}>Answer:</Title>}
      style={{
        borderRadius: "8px",
        marginBottom: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{answer}</ReactMarkdown>
    </Card>
  );
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showParticles, setShowParticles] = useState<boolean>(false);

  const handleRevealAnswer = async () => {
    setLoading(true);
    setShowParticles(true);
    try {
      const fetchedAnswer = await getInterviewAnswer(question.question);
      setAnswer(fetchedAnswer.answer);
    } catch {
      message.error("Failed to fetch answer");
      setShowParticles(false);
    } finally {
      setLoading(false);
    }
  };

  const particleVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <Card
      style={{
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
        border: "2px solid #a0d2eb",
        marginBottom: "20px",
        backgroundColor: "#f8f9fa",
      }}
      title={
        <Space>
          <QuestionCircleOutlined />
          <Text strong>{`Question ${index + 1}`}</Text>
          <Tag color={difficultyColors[question.difficulty]}>
            {question.difficulty.toUpperCase()}
          </Tag>
          <Tag color="blue">{question.type}</Tag>
        </Space>
      }
      extra={
        <Button
          type={expanded ? "default" : "primary"}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "Show Details"}
        </Button>
      }
    >
      <div
        style={{
          marginBottom: "20px",
          padding: "16px",
          backgroundColor: "#e6f7ff",
          borderRadius: "8px",
        }}
      >
        <Title level={4} style={{ marginBottom: "12px" }}>
          Question:
        </Title>
        <QuestionContent question={question} />
      </div>
      <Collapse activeKey={expanded ? ["1"] : []}>
        <Panel header={null} key="1">
          <Paragraph>
            <Text strong>Type:</Text> {question.type}
          </Paragraph>
          <Paragraph>
            <Text strong>Assessment:</Text> {question.assessment}
          </Paragraph>
          <Divider />
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button
              type="primary"
              onClick={handleRevealAnswer}
              loading={loading}
              disabled={!!answer}
              icon={
                answer ? (
                  <CheckCircleOutlined />
                ) : (
                  <SyncOutlined spin={loading} />
                )
              }
            >
              {answer ? "Answer Revealed" : "Reveal Answer"}
            </Button>
            <AnimatePresence>
              {showParticles && (
                <ParticleContainer>
                  {[...Array(40)].map((_, i) => (
                    <Particle
                      key={i}
                      variants={particleVariants}
                      initial="initial"
                      animate="animate"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </ParticleContainer>
              )}
              {answer && <AnswerCard answer={answer} />}
            </AnimatePresence>
          </Space>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default QuestionCard;
