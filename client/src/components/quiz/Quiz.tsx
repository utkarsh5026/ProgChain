import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import QuizSetupModal from "./QuizSetupModal";
import type { QuizSetupValues } from "../../store/quiz/type";
import useQuiz from "../../store/quiz/hook";
import QuizContent from "./QuizContent";

const Quiz: React.FC = () => {
  const { quiz, fecthQuiz } = useQuiz();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as QuizSetupValues | null;
    if (state) {
      fecthQuiz(state);
    }
  }, [location, fecthQuiz]);

  console.log("quiz", quiz);

  if (!quiz) {
    return <QuizSetupModal visible={quiz === null} />;
  }

  return (
    <div style={{ width: "70vw" }}>
      {quiz.instructions && <p>Additional Instructions: {quiz.instructions}</p>}
      <QuizContent questions={quiz.questions} onAnswerChange={() => {}} />
    </div>
  );
};

export default Quiz;
