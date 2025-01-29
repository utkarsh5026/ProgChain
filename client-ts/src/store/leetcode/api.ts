import caller from "../../api/caller";

export const searchProblems = async (query: string) => {
  const response = await caller.get(`/leetcode/search?query=${query}`);
  return response.data;
};

export const fetchProblems = async (page: number, limit: number) => {
  const response = await caller.get(
    `/leetcode/problems?page=${page}&limit=${limit}`
  );
  return response.data;
};
