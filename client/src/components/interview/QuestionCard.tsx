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
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css"; // Choose your preferred style

import type { Difficulty, Question } from "../../store/interview/type";
import { getInterviewAnswer } from "../../store/interview/api";

const { Text, Paragraph, Title } = Typography;
const { Panel } = Collapse;

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

const QuestionContent: React.FC<QuestionContentProps> = ({ question }) => {
  switch (question.type) {
    case "multiple-choice":
      return (
        <div>
          <Title level={5}>{question.question}</Title>
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
          <Title level={4}>{question.question}</Title>
        </div>
      );
    case "open-ended":
    case "scenario-based":
    default:
      return <Paragraph>{question.question}</Paragraph>;
  }
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleRevealAnswer = async () => {
    setLoading(true);
    try {
      const answer = await getInterviewAnswer(question.question);
      console.log(answer);
      setAnswer(answer.answer);
      message.success("Answer revealed successfully");
    } catch {
      message.error("Failed to fetch answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
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
      style={{ marginBottom: 16 }}
    >
      <QuestionContent question={question} />
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
            {answer && (
              <Card
                title="Answer"
                size="small"
                bordered={false}
                style={{ backgroundColor: "#f6f6f6" }}
              >
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {answer}
                </ReactMarkdown>
              </Card>
            )}
          </Space>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default QuestionCard;
