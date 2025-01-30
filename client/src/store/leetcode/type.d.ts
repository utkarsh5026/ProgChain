type ProblemDifficulty = "Easy" | "Medium" | "Hard";

type Model = "gpt-4o" | "gpt-3.5-turbo" | "claude-3-5-sonnet" | "gpt-4o-mini";

export interface ProblemBasic {
  id: number;
  name: string;
  link: string;
  difficulty: string;
  acceptance_rate: string;
  tags: {
    name: string;
    id: string;
  }[];
}

export type ProblemAdvanced = ProblemBasic & {
  description: string;
};

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

export type Solution = {
  language: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
};

export type QuestionDetail = {
  model: Model;
  problem: ProblemAdvanced;
  chat: {
    question: string;
    answer: string;
    model: Model;
  }[];
  solution: Solution[];
};
