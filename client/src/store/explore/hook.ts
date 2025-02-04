import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  fetchQuestionThunk,
  askQuestionThunk,
  fetchQuestionStart,
  resetExplore as resetExploreAction,
} from "./slice";
import type { Question } from "./type";
import type { Model } from "@/config/config";

interface UseExploreHook {
  rootQuestion: Question | null;
  loading: boolean;
  error: string | null;
  currentPath: string[];
  currentQuestion: Question | null;
  fetchQuestion: (
    question: string,
    model: Model,
    extraInstructions?: string
  ) => Promise<void>;
  askQuestion: (
    question: string,
    model: Model,
    extraInstructions?: string
  ) => Promise<void>;
  startQuestionFetching: (question: string) => void;
  getQuestion: (id: string) => Question | null;
  resetExplore: () => void;
}

const useExplore = (): UseExploreHook => {
  const dispatch = useAppDispatch();
  const {
    rootQuestion,
    loading,
    error,
    currentPath,
    questMap,
    currentQuestion,
    currentChatId,
  } = useAppSelector((state) => state.explore);

  const fetchQuestion = useCallback(
    async (question: string, model: Model, extraInstructions?: string) => {
      dispatch(fetchQuestionStart(question));
      await dispatch(
        fetchQuestionThunk({
          question,
          model,
          extraInstructions,
        })
      );
    },
    [dispatch]
  );

  const askQuestion = useCallback(
    async (question: string, model: Model, extraInstructions?: string) => {
      if (!currentChatId) return;
      dispatch(fetchQuestionStart(question));
      await dispatch(
        askQuestionThunk({
          question,
          model,
          extraInstructions,
          chat_id: currentChatId,
        })
      );
    },
    [dispatch, currentChatId]
  );

  const startQuestionFetching = useCallback(
    (question: string) => {
      dispatch(fetchQuestionStart(question));
    },
    [dispatch]
  );

  const getQuestion = useCallback(
    (id: string) => {
      return questMap[id];
    },
    [questMap]
  );

  const resetExplore = useCallback(() => {
    dispatch(resetExploreAction());
  }, [dispatch]);

  return {
    rootQuestion,
    loading,
    error,
    currentPath,
    currentQuestion,
    fetchQuestion,
    askQuestion,
    startQuestionFetching,
    getQuestion,
    resetExplore,
  };
};

export default useExplore;
