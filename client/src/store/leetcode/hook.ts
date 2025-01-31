import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchProblemsThunk, fetchInfoThunk } from "./slice";
import type { ProblemFilters, SolutionRequest } from "./type";
import { fetchProblemInfoThunk, generateSolutionThunk } from "./problemSlice";

const useProblems = () => {
  const dispatch = useAppDispatch();
  const { problemList, loading, error, tags, pageSize, problemCnt } =
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
    problemList,
    loading,
    error,
    fetchProblems,
    fetchInfo,
    tags,
    pageSize,
    problemCnt,
  };
};

export const useProblem = () => {
  const dispatch = useAppDispatch();
  const { problemInfo, loading, solutionLoading, chatLoading, error } =
    useAppSelector((state) => state.problem);

  const fetchProblemInfo = useCallback(
    async (problemName: string) => {
      await dispatch(fetchProblemInfoThunk(problemName));
    },
    [dispatch]
  );

  const generateSolution = useCallback(
    async (request: SolutionRequest) => {
      await dispatch(generateSolutionThunk(request));
    },
    [dispatch]
  );

  return {
    problemInfo,
    loading,
    solutionLoading,
    chatLoading,
    error,
    fetchProblemInfo,
    generateSolution,
  };
};

export default useProblems;
