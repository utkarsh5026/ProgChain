export type QuestionType =
  | "multiple-choice"
  | "coding-challenge"
  | "open-ended"
  | "scenario-based";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
  assessment: string;
  options?: string[]; // Only for multiple-choice questions
}
