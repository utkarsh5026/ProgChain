import React from "react";
import { Typography, Divider } from "antd";
import type { Question } from "../../store/interview/type";

const { Title, Paragraph } = Typography;
import QuestionCard from "./QuestionCard";

interface ProgrammingQAComponentProps {
  questions: Question[];
}

const ProgrammingQAComponent: React.FC<ProgrammingQAComponentProps> = ({
  questions,
}) => {
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
        This component displays a series of programming questions. Click 'Reveal
        Answer' to see the answer for each question.
      </Paragraph>
      <Divider />
      {questions.map((question, index) => (
        <QuestionCard key={index} question={question} index={index} />
      ))}
    </div>
  );
};

export default ProgrammingQAComponent;
