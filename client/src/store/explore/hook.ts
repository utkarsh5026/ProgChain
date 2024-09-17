import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  fetchQuestionThunk,
  fetchQuestionStart,
  resetExplore as resetExploreAction,
} from "./slice";
import { Question } from "./type";

interface UseExploreHook {
  rootQuestion: Question | null;
  loading: boolean;
  error: string | null;
  currentPath: string[];
  currentQuestion: Question | null;
  fetchQuestion: (question: string) => Promise<void>;
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
  } = useAppSelector((state) => state.explore);

  const fetchQuestion = useCallback(
    async (question: string) => {
      dispatch(fetchQuestionStart(question));
      await dispatch(fetchQuestionThunk(question));
    },
    [dispatch]
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
    startQuestionFetching,
    getQuestion,
    resetExplore,
  };
};

export default useExplore;
