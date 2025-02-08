import React from "react";
import useExplore from "@/store/explore/hook";
import Message from "../llm/Message";

interface ExplanationProps {
  questionID: string;
}

const Explanation: React.FC<ExplanationProps> = ({ questionID }) => {
  const { getQuestion, loading } = useExplore();
  const question = getQuestion(questionID);

  if (question === null) return null;

  const { text, explanation } = question;
  return (
    <Message
      userQuestion={text}
      aiResponse={explanation}
      chatId={parseInt(questionID)}
      loading={loading}
    />
  );
};

export default Explanation;
