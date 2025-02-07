import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  fetchQuestionThunk,
  askQuestionThunk,
  fetchQuestionStart,
  resetExplore as resetExploreAction,
} from "./slice";
import type { Model } from "@/config/config";
import { fetchChatHistoryThunk } from "./chatsSlice";

const useExplore = () => {
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

export const useExploreChats = () => {
  const dispatch = useAppDispatch();
  const { chats, loading, error } = useAppSelector(
    (state) => state.exploreChats
  );

  const fetchChatHistory = useCallback(
    async (limit: number, page: number) => {
      await dispatch(fetchChatHistoryThunk({ limit, page }));
    },
    [dispatch]
  );

  return {
    chats,
    loading,
    error,
    fetchChatHistory,
  };
};

export default useExplore;
