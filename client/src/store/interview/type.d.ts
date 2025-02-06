import { z } from "zod";
import type { Model } from "@/config/config";

const DifficultySchema = z.enum(["Beginner", "Intermediate", "Advanced"]);

export type Difficulty = z.infer<typeof DifficultySchema>;
export type DifficultyMap = Map<Difficulty, Question[]>;

export type Question = {
  id: number;
  question: string;
  type: string;
  assessment: string;
};

export type RequestQuestion = {
  topic: string;
  context: string;
  extraInstructions: string;
  model: Model;
};

export type ResponseQuestion = {
  topic: string;
  questions: DifficultyMap;
};

export type TopicQuestions = {
  topic: string;
  context: string;
  questions: DifficultyMap;
};
