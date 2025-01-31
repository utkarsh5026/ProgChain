import { z } from "zod";

const ProblemDifficultySchema = z.enum(["Easy", "Medium", "Hard"]);

const Model = z.enum([
  "gpt-4o",
  "gpt-3.5-turbo",
  "claude-3-5-sonnet",
  "gpt-4o-mini",
]);

const ProblemBasicSchema = z.object({
  id: z.number(),
  name: z.string(),
  link: z.string(),
  difficulty: ProblemDifficultySchema,
  acceptance_rate: z.string(),
  tags: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
    })
  ),
});

const ProblemAdvancedSchema = ProblemBasicSchema.extend({
  description: z.string(),
});

const ProblemListSchema = z.object({
  problems: z.array(ProblemBasicSchema),
  pageCount: z.number(),
  currentPage: z.number(),
  currentLimit: z.number(),
});

const ProblemFiltersSchema = z.object({
  page: z.number(),
  limit: z.number(),
  difficulty: z.array(z.string()),
  tags: z.array(z.string()),
  acceptanceSort: z.string(),
  firstQuery: z.boolean(),
});

const SolutionSchema = z.object({
  language: z.string(),
  code: z.string(),
  timeComplexity: z.string(),
  spaceComplexity: z.string(),
});

const QuestionDetailSchema = z.object({
  model: Model,
  problem: ProblemAdvancedSchema,
  chat: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      model: Model,
    })
  ),
  solution: z.record(z.string(), SolutionSchema),
});

const SolutionRequestSchema = z.object({
  model: Model,
  problemId: z.number(),
  progLang: z.string(),
  additionalContext: z.string(),
});

type ProblemBasic = z.infer<typeof ProblemBasicSchema>;
type ProblemAdvanced = z.infer<typeof ProblemAdvancedSchema>;
type ProblemList = z.infer<typeof ProblemListSchema>;
type ProblemFilters = z.infer<typeof ProblemFiltersSchema>;
type Solution = z.infer<typeof SolutionSchema>;
type QuestionDetail = z.infer<typeof QuestionDetailSchema>;
type SolutionRequest = z.infer<typeof SolutionRequestSchema>;
type ProblemDifficulty = z.infer<typeof ProblemDifficultySchema>;

export {
  ProblemDifficultySchema,
  Model,
  ProblemBasicSchema,
  ProblemAdvancedSchema,
  ProblemListSchema,
  ProblemFiltersSchema,
  SolutionSchema,
  QuestionDetailSchema,
  SolutionRequestSchema,
  // Types
  type ProblemBasic,
  type ProblemAdvanced,
  type ProblemList,
  type ProblemFilters,
  type Solution,
  type QuestionDetail,
  type SolutionRequest,
  type ProblemDifficulty,
};
