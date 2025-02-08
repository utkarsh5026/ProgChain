import React from "react";
import useExplore from "@/store/explore/hooks/use-explore";
import Message from "../llm/Message";

interface ExplanationProps {
  questionID: number;
}

const Explanation: React.FC<ExplanationProps> = ({ questionID }) => {
  const { getQuestion, currentQuestion, rootQuestion, questMap } = useExplore();
  const question = getQuestion(questionID);

  console.log("question", question, questionID, rootQuestion, currentQuestion);
  console.dir(questMap, { depth: null });

  if (question === null) return null;

  const { text, explanation } = question;
  return (
    <Message
      userQuestion={text}
      aiResponse={explanation}
      chatId={questionID}
      loading={question.generating}
    />
  );
};

export default Explanation;
