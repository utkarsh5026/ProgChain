import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { fetchProblemsThunk } from "./slice";
import type { ProblemFilters } from "./type";

const useProblems = () => {
  const dispatch = useAppDispatch();
  const { problems, loading, error } = useAppSelector(
    (state) => state.problemList
  );

  const fetchProblems = useCallback(
    async (filters: ProblemFilters) => {
      await dispatch(fetchProblemsThunk(filters));
    },
    [dispatch]
  );

  return {
    problems,
    loading,
    error,
    fetchProblems,
  };
};

export default useProblems;
