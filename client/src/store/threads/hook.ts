import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { createThreadThunk, generateThreadThunk, resetThread } from "./slice";
import type { BaseLLMRequest } from "@/base";

const useThreads = () => {
  const dispatch = useAppDispatch();
  const { thread, creating, generating } = useAppSelector(
    (state) => state.threads
  );

  const createThread = useCallback(
    (topic: string, options: Partial<BaseLLMRequest>) => {
      dispatch(createThreadThunk({ topic, ...options }));
    },
    [dispatch]
  );

  const fetchMoreContent = useCallback(
    (options: Partial<BaseLLMRequest>) => {
      if (!thread) return;

      const threadID = thread.threadID;
      dispatch(generateThreadThunk({ threadID, ...options }));
    },
    [dispatch]
  );

  const reset = useCallback(() => {
    dispatch(resetThread());
  }, [dispatch]);

  return {
    thread,
    creating,
    generating,
    createThread,
    fetchMoreContent,
    reset,
  };
};

export default useThreads;
