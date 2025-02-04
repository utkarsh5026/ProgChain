import type { Model } from "@/config/config";

export interface Question {
  id: string;
  text: string;
  explanation: string;
  relatedQuestionIDs: string[];
  followUpQuestionIDs: string[];
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
