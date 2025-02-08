import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createThreadThunk,
  fetchThreadThunk,
  generateThreadThunk,
  resetThread,
} from "@/store/threads/slice";
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

  const fetchThread = useCallback(
    (threadID: number) => {
      dispatch(fetchThreadThunk(threadID));
    },
    [dispatch]
  );

  return {
    thread,
    creating,
    generating,
    createThread,
    fetchThread,
    fetchMoreContent,
    reset,
  };
};

export default useThreads;
