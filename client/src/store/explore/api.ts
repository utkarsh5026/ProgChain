import { streamText } from "@/api/stream";
import caller, { API_BASE_URL } from "@/api/caller";
import type { Model } from "@/config/config";
import type { QuestionRequest } from "./type";

const EXPLORE_URL = `${API_BASE_URL}/explore`;

export const exploreTopic = async function* (
  topic: string,
  model: Model = "gpt-4o-mini",
  extraInstructions?: string
) {
  const url = `${API_BASE_URL}/explore/topic`;
  const postBody = {
    topic: topic,
    model: model,
    extra_instructions: extraInstructions,
  };

  for await (const chunk of streamText(url, postBody)) {
    yield chunk;
  }
};

export const askQuestion = async function* (questionRequest: QuestionRequest) {
  const { question, model, extraInstructions, chat_id } = questionRequest;
  const url = `${API_BASE_URL}/explore/question`;
  const postBody = {
    question: question,
    model: model,
    extra_instructions: extraInstructions,
    chat_id: chat_id,
  };

  for await (const chunk of streamText(url, postBody)) {
    yield chunk;
  }
};

export const getChatHistory = async (limit: number = 10, page: number = 1) => {
  const url = `${API_BASE_URL}/explore/chats`;
  const postBody = {
    limit: limit,
    page: page,
  };
  const response = await caller.get(url, { params: postBody });
  return response.data;
};

export const deleteChat = async (chat_id: number) => {
  const url = `${EXPLORE_URL}/chat/${chat_id}`;
  const response = await caller.delete(url);
  return response.data;
};
