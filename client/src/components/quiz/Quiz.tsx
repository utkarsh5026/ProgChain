import React, { useEffect, useState } from "react";
import { Space, Button } from "antd";
import { CheckCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import QuizSetupModal from "./QuizSetupModal";
import type { QuizSetupValues } from "../../store/quiz/type";
import useQuiz from "../../store/quiz/hook";
import QuizContent from "./QuizContent";
import DownloadDropdown from "./DownloadDropdown";
import SubmitModal from "./SubmitModal";

const Quiz: React.FC = () => {
  const { quiz, fecthQuiz, submitQuiz } = useQuiz();
  const location = useLocation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSetupModalVisible, setIsSetupModalVisible] = useState(false);

  const handleSubmit = () => {
    submitQuiz();
    setIsModalVisible(false);
  };

  const handleClickSubmit = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleSetupModal = () => setIsSetupModalVisible(true);
  const handleSetupModalClose = () => setIsSetupModalVisible(false);

  useEffect(() => {
    const state = location.state as QuizSetupValues | null;
    if (state) fecthQuiz(state);
  }, [location, fecthQuiz]);

  if (!quiz) return <QuizSetupModal visible={true} />;

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
        <Button icon={<PlusOutlined />} onClick={handleSetupModal}>
          Generate Another Quiz
        </Button>
        <Button
          type="primary"
          disabled={quiz.submitted}
          onClick={handleClickSubmit}
          icon={<CheckCircleOutlined />}
        >
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
      <QuizSetupModal
        visible={isSetupModalVisible}
        extraProps={{
          closable: true,
          onCancel: handleSetupModalClose,
        }}
      />
    </Space>
  );
};

export default Quiz;
