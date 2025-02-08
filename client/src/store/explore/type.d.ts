import type { Model } from "@/config/config";
import type { Operation } from "@/base";
export interface Question {
  id: number;
  text: string;
  explanation: string;
  generating: Operation;
}

export interface ResponseQuestion {
  explanation: string;
  follow_up_questions: string[];
}

export type TopicRequest = {
  question: string;
  model: Model;
  extraInstructions?: string;
};

export type QuestionRequest = TopicRequest & {
  chat_id: number;
};

export type ChatBasic = {
  topic: string;
  createdAt: string;
  updatedAt: string;
  id: number;
};
