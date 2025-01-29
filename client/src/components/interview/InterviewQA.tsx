import React, { useState } from "react";
import { Typography, Divider, Button, Spin, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import QuestionCard from "./QuestionCard";
import { motion } from "framer-motion";
import type { Question } from "../../store/interview/type";
import { useInterviewQuestions } from "../../store/interview/hooks";

const { Title, Paragraph } = Typography;

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

      {(
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
