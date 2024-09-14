import React, { useEffect, useState } from "react";
import { Space, Button } from "antd";
import { useLocation } from "react-router-dom";
import QuizSetupModal from "./QuizSetupModal";
import type { QuizSetupValues } from "../../store/quiz/type";
import useQuiz from "../../store/quiz/hook";
import QuizContent from "./QuizContent";
import DownloadDropdown from "./DownloadDropdown";
import SubmitModal from "./SubmitModal";

const Quiz: React.FC = () => {
  const { quiz, fecthQuiz } = useQuiz();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleClickSubmit = () => {
    setIsModalVisible(true);
  };

  const handleSubmit = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
        <Button type="primary" onClick={handleClickSubmit}>
          Submit Quiz
        </Button>
      </div>
      {quiz.instructions && <p>Additional Instructions: {quiz.instructions}</p>}
      <QuizContent questions={quiz.questions} />
      <SubmitModal
        visible={isModalVisible}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        questions={quiz.questions}
      />
    </Space>
  );
};

export default Quiz;
