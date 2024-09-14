import React, { useEffect } from "react";
import { Space } from "antd";
import { useLocation } from "react-router-dom";
import QuizSetupModal from "./QuizSetupModal";
import type { QuizSetupValues } from "../../store/quiz/type";
import useQuiz from "../../store/quiz/hook";
import QuizContent from "./QuizContent";
import DownloadDropdown from "./DownloadDropdown";

const Quiz: React.FC = () => {
  const { quiz, fecthQuiz } = useQuiz();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as QuizSetupValues | null;
    if (state) fecthQuiz(state);
  }, [location, fecthQuiz]);

  if (!quiz) return <QuizSetupModal visible={quiz === null} />;

  return (
    <Space direction="vertical" size="large" style={{ width: "70vw" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <DownloadDropdown quiz={quiz} />
      </div>
      {quiz.instructions && <p>Additional Instructions: {quiz.instructions}</p>}
      <QuizContent questions={quiz.questions} onAnswerChange={() => {}} />
    </Space>
  );
};

export default Quiz;
