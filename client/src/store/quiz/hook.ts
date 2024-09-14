import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { generateQuizThunk } from "./slice";
import type { QuizSetupValues, Quiz } from "./type";

interface QuizHook {
  quiz: Quiz | null;
  loading: boolean;
  error: string | null;
  fecthQuiz: (values: QuizSetupValues) => Promise<void>;
}

/**
 * Custom hook for managing quiz state and actions.
 *
 * @returns {QuizHook} An object containing:
 *   - quiz: The current quiz state (Quiz object or null)
 *   - loading: Boolean indicating if a quiz is being fetched
 *   - error: Error message string or null
 *   - fecthQuiz: Function to dispatch the quiz generation action
 */
const useQuiz = (): QuizHook => {
  const dispatch = useAppDispatch();
  const { quiz, loading, error } = useAppSelector((state) => state.quiz);

  const fecthQuiz = useCallback(
    async (values: QuizSetupValues) => {
      await dispatch(generateQuizThunk(values));
    },
    [dispatch]
  );

  return { quiz, loading, error, fecthQuiz };
};

export default useQuiz;
