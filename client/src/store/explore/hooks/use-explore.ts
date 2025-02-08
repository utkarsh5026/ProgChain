import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  fetchQuestionThunk,
  askQuestionThunk,
  loadChatThunk,
  fetchQuestionStart,
  resetExplore as resetExploreAction,
} from "../slice";

import type { Model } from "@/config/config";

const useExplore = () => {
  const dispatch = useAppDispatch();
  const {
    rootQuestion,
    loading,
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
    (id: number) => {
      return questMap[id];
    },
    [questMap]
  );

  const loadChat = useCallback(
    (chatId: number) => {
      dispatch(loadChatThunk(chatId));
    },
    [dispatch]
  );

  const resetExplore = useCallback(() => {
    dispatch(resetExploreAction());
  }, [dispatch]);

  return {
    rootQuestion,
    loading,
    currentPath,
    currentQuestion,
    questMap,
    fetchQuestion,
    askQuestion,
    startQuestionFetching,
    getQuestion,
    loadChat,
    resetExplore,
  };
};

export default useExplore;
