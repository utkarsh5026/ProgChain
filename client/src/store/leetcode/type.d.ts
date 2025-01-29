type ProblemDifficulty = "Easy" | "Medium" | "Hard";

export interface ProblemBasic {
  problem: string;
  link: string;
  difficulty: string;
  acceptance_rate: string;
}

export interface ProblemList {
  problems: ProblemBasic[];
  pageCount: number;
  currentPage: number;
  currentLimit: number;
}

interface ProblemFilters {
  page: number;
  limit: number;
  difficulty?: ProblemDifficulty;
}
