import { streamText } from "@/api/stream";
import caller, { API_BASE_URL } from "@/api/caller";
import type { Model } from "@/config/config";
import type { QuestionRequest, Question, ChatBasic, ChatStats } from "./type";

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

export const getChatHistory = async (
  limit: number = 10,
  page: number = 1
): Promise<ChatBasic[]> => {
  const url = `${API_BASE_URL}/explore/chats/list`;
  const postBody = {
    limit: limit,
    page: page,
  };
  const response = await caller.get(url, { params: postBody });
  const data = response.data;

  return data.map(({ chat, stats }: { chat: any; stats: any }) => {
    return {
      id: chat.public_id,
      topic: chat.chat_topic,
      createdAt: chat.created_at,
      updatedAt: chat.updated_at,
      totalTokens: stats.total_tokens,
      promptTokens: stats.prompt_tokens,
      completionTokens: stats.completion_tokens,
      msgCnt: stats.msg_cnt,
      totalCost: stats.total_cost,
    };
  });
};

export const deleteChat = async (chat_id: string) => {
  const url = `${EXPLORE_URL}/chat/${chat_id}`;
  const response = await caller.delete(url);
  return response.data;
};

export const loadChat = async (chat_id: number): Promise<Question[]> => {
  const url = `${EXPLORE_URL}/chat/${chat_id}`;
  const response = await caller.get(url);
  const chat = response.data.chat;

  return chat.map((message: any) => {
    return {
      id: message.chat_id,
      text: message.user_question,
      explanation: message.assistant_answer,
    };
  });
};
