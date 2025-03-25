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

export type ChatStats = {
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  msgCnt: number;
  totalCost: number;
};

export type ChatBasic = ChatStats & {
  topic: string;
  createdAt: string;
  updatedAt: string;
  id: string;
};
