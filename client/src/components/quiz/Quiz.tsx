import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus } from "lucide-react";
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
    <div className="w-[70vw] flex flex-col gap-8">
      <div className="flex justify-between items-center mb-4">
        <DownloadDropdown quiz={quiz} />
        <Button onClick={handleSetupModal}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Another Quiz
        </Button>
        <Button
          disabled={quiz.submitted}
          onClick={handleClickSubmit}
          variant="default"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
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
      <QuizSetupModal visible={isSetupModalVisible} />
    </div>
  );
};

export default Quiz;
