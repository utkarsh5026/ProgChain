type Level = "easy" | "medium" | "hard";
type QuestionType = "multiple_choice" | "single_choice";
type CompletionStatus =
  | "completed"
  | "not_started"
  | "left_for_review"
  | "skip";

export interface QuizSetupValues {
  topic: string;
  levels: string[];
  instructions?: string;
  count: number;
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  answers: string[];
  level: Level;
  type: QuestionType;
  correctAnswers: number[];
  category: string;
  status: CompletionStatus;
  selectedOptions: number[];
}

export interface Quiz {
  topic: string;
  questions: Question[];
  instructions?: string;
}
