import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchQuestionsThunk } from "./slice";
import type { TopicQuestions, RequestQuestion, ResponseQuestion } from "./type";

interface InterviewQuestionsHook {
  topicQuestions: Record<string, TopicQuestions>;
  currentTopic: string | null;
  generating: boolean;
  loading: boolean;
  error: string | null;
  fetchQuestions: (request: RequestQuestion) => Promise<void>;
  getCachedQuestions: (
    topic: string,
    context: string
  ) => ResponseQuestion | null;
}

/**
 * Custom hook for managing interview questions.
 * @returns {InterviewQuestionsHook} An object containing functions to fetch and retrieve cached questions.
 */
export const useInterviewQuestions = (): InterviewQuestionsHook => {
  const { topicQuestions, currentTopic, generating, loading, error } =
    useAppSelector((state) => state.questions);
  const dispatch = useAppDispatch();

  const fetchQuestions = useCallback(
    async (request: RequestQuestion) => {
      dispatch(fetchQuestionsThunk(request));
    },
    [dispatch]
  );

  const getCachedQuestions = useCallback(
    (topic: string, context: string) => {
      const questions = topicQuestions[topic];
      for (const question of questions) {
        if (question.context === context) {
          return question;
        }
      }
      return null;
    },
    [topicQuestions]
  );

  return {
    topicQuestions,
    fetchQuestions,
    getCachedQuestions,
    loading,
    error,
    generating,
    currentTopic,
  };
};
