import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  generateQuizThunk,
  changeQuestionStatus as changeQuestionStatusAction,
  changeSelectedAnswers as changeSelectedAnswersAction,
  markQuestionAsNotCompleted as markQuestionAsNotCompletedAction,
  submitQuiz as submitQuizAction,
} from "./slice";
import type { QuizSetupValues, Quiz, CompletionStatus } from "./type";

interface QuizHook {
  quiz: Quiz | null;
  loading: boolean;
  error: string | null;
  fecthQuiz: (values: QuizSetupValues) => Promise<void>;
  submitQuiz: () => Promise<void>;
  isSubmitted: boolean;
}

/**
 * Custom hook for managing quiz state and actions.
 *
 * @returns {QuizHook} An object containing:
 *   - quiz: The current quiz state (Quiz object or null)
 *   - loading: Boolean indicating if a quiz is being fetched
 *   - error: Error message string or null
 *   - fecthQuiz: Function to dispatch the quiz generation action
 *   - submitQuiz: Function to dispatch the quiz submission action
 *   - isSubmitted: Boolean indicating if the quiz is submitted
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

  const submitQuiz = useCallback(async () => {
    dispatch(submitQuizAction());
  }, [dispatch]);

  const isSubmitted = useMemo(
    () => quiz?.submitted ?? false,
    [quiz?.submitted]
  );

  return { quiz, loading, error, fecthQuiz, submitQuiz, isSubmitted };
};

interface QuizQuestionHook {
  changeQuestionStatus: (status: CompletionStatus, questionIdx: number) => void;
  changeSelectedOptions: (answers: number[], questionIdx: number) => void;
}

/**
 * Custom hook for managing quiz question state and actions.
 *
 * @returns {QuizQuestionHook} An object containing:
 *   - changeQuestionStatus: Function to update the completion status of a question
 *   - changeSelectedOptions: Function to update the selected answers for a question
 */
const useQuizQuestion = (): QuizQuestionHook => {
  const dispatch = useAppDispatch();

  const changeQuestionStatus = useCallback(
    (status: CompletionStatus, questionIdx: number) => {
      if (status === "not_started")
        dispatch(markQuestionAsNotCompletedAction(questionIdx));
      else dispatch(changeQuestionStatusAction({ status, questionIdx }));
    },
    [dispatch]
  );

  const changeSelectedOptions = useCallback(
    (answers: number[], questionIdx: number) => {
      dispatch(changeSelectedAnswersAction({ answers, questionIdx }));
    },
    [dispatch]
  );

  return { changeQuestionStatus, changeSelectedOptions };
};

export default useQuiz;
export { useQuizQuestion };
