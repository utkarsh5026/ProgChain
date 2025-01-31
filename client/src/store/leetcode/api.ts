import caller from "../../api/caller";
import type {
  ProblemAdvanced,
  SolutionRequest,
  Solution,
  ProblemFilters,
} from "./type";

export const searchProblems = async (query: string) => {
  const response = await caller.get(`/leetcode/search?query=${query}`);
  return response.data;
};

export const fetchProblems = async (filters: ProblemFilters) => {
  const params = new URLSearchParams();
  params.append("page", filters.page.toString());
  params.append("limit", filters.limit.toString());
  params.append("firstQuery", "true");
  params.append("acceptanceSort", filters.acceptanceSort);

  // Properly append array parameters
  filters.difficulty.forEach((diff) => {
    params.append("difficulty", diff);
  });

  filters.tags.forEach((tag) => {
    params.append("tags", tag);
  });
  const response = await caller.get(`/leetcode/problems`, {
    params: params,
  });
  return response.data;
};

export const fetchTags = async () => {
  const response = await caller.get("/leetcode/tags");
  return response.data;
};

export const fetchInfo = async () => {
  const response = await caller.get("/leetcode/info");
  return response.data;
};

export const fetchProblemInfo = async (problemName: string) => {
  const response = await caller.get(`/leetcode/problem/${problemName}`);
  return response.data as ProblemAdvanced;
};

export const generateSolution = async ({
  model,
  problemId,
  progLang,
  additionalContext,
}: SolutionRequest) => {
  const response = await caller.post("/leetcode/solution", {
    model,
    problem_id: problemId,
    prog_lang: progLang,
    additional_context: additionalContext,
  });
  return response.data as Solution;
};
