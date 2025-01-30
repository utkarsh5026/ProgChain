import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchProblemsThunk, fetchInfoThunk } from "./slice";
import type { ProblemFilters } from "./type";

const useProblems = () => {
  const dispatch = useAppDispatch();
  const { problems, loading, error, tags, pageSize, problemCnt } =
    useAppSelector((state) => state.problemList);

  const fetchProblems = useCallback(
    async (filters: ProblemFilters) => {
      await dispatch(fetchProblemsThunk(filters));
    },
    [dispatch]
  );

  const fetchInfo = useCallback(async () => {
    await dispatch(fetchInfoThunk());
  }, [dispatch]);

  return {
    problems,
    loading,
    error,
    fetchProblems,
    fetchInfo,
    tags,
    pageSize,
    problemCnt,
  };
};

export default useProblems;
