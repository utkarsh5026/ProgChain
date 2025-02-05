import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchThreadContentThunk, intiThread } from "./slice";

const useThreads = () => {
  const dispatch = useAppDispatch();
  const { thread, loading, error } = useAppSelector((state) => state.threads);

  const fetchThreadContent = useCallback(
    (topic: string) => {
      const idx = thread?.content.length ?? 0;
      dispatch(fetchThreadContentThunk({ topic, currentIdx: idx }));
    },
    [dispatch, thread?.content]
  );

  const initThread = useCallback(
    (topic: string) => {
      dispatch(intiThread(topic));
    },
    [dispatch]
  );

  return { thread, loading, error, fetchThreadContent, initThread };
};

export default useThreads;
