type Level = "easy" | "medium" | "hard";
type QuestionType = "multiple_choice" | "single_choice";

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
  text: string;
  answers: string[];
  level: Level;
  type: QuestionType;
  correctAnswers: string[];
  category: string;
}

export interface Quiz {
  topic: string;
  questions: Question[];
  instructions?: string;
}
