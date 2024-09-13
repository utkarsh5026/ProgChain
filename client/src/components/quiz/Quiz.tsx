import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuizSetupModal, { QuizSetupValues } from "./QuizSetupModal";

const Quiz: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [quizState, setQuizState] = useState<QuizSetupValues | null>(null);
  const location = useLocation();

  useEffect(() => {
    const state = location.state as QuizSetupValues | null;
    if (state) {
      setQuizState(state);
    } else {
      setIsModalVisible(true);
    }
  }, [location]);

  if (!quizState) {
    return <QuizSetupModal visible={isModalVisible} />;
  }

  return (
    <div>
      <h1>Quiz: {quizState.topic}</h1>
      <p>Difficulty: {quizState.levels.join(", ")}</p>
      {quizState.instructions && (
        <p>Additional Instructions: {quizState.instructions}</p>
      )}
      {/* Add your quiz content here */}
    </div>
  );
};

export default Quiz;
