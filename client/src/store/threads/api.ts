import { postStream } from "@/api/stream";
import type { LearningContent, ThreadMessage } from "./types";
import caller, { API_BASE_URL } from "@/api/caller";
import { req, type BaseLLMRequest } from "@/base";

const BASE_THREAD_URL = `${API_BASE_URL}/threads`;
const GENERATE_URL = `${BASE_THREAD_URL}/generate`;
const CREATE_URL = `${BASE_THREAD_URL}/create`;

export type ThreadCreateRequest = BaseLLMRequest & {
  topic: string;
};

export type ThreadGenerateRequest = BaseLLMRequest & {
  threadID: number;
};

export type ThreadChatRequest = BaseLLMRequest & {
  threadContentId: number;
};

type ThreadContent = {
  threadID: number;
  content: LearningContent;
};

const parseContent = (thread: any): ThreadContent => {
  const threadID = thread.thread_id;
  const content = thread.content;
  return {
    threadID,
    content: {
      topic: content.thread_topic,
      content: content.content,
      id: content.content_id,
    },
  };
};

export const createThread = async function* (
  request: ThreadCreateRequest
): AsyncGenerator<ThreadContent, void> {
  const body = {
    topic: request.topic,
    model: request.model,
    prompt_instructions: request.promptInstructions,
  };
  for await (const content of postStream(CREATE_URL, body)) {
    yield parseContent(content);
  }
};

export const generateThread = async function* (
  request: ThreadGenerateRequest
): AsyncGenerator<ThreadContent, void> {
  const body = {
    thread_id: request.threadID,
    model: request.model,
    prompt_instructions: request.promptInstructions,
  };
  for await (const content of postStream(GENERATE_URL, body)) {
    yield parseContent(content);
  }
};

export const fetchThread = async (
  threadID: number
): Promise<{
  threadID: number;
  contents: LearningContent[];
}> => {
  const response = await fetch(`${BASE_THREAD_URL}/${threadID}`);
  const data = await response.json();
  console.log(data);
  return {
    threadID,
    contents: data.map((content: any) => ({
      id: content.id,
      topic: content.topic,
      content: content.content,
    })),
  };
};

export const getAllThreads = async () => {
  const response = await fetch(`${BASE_THREAD_URL}`);
  return response.json();
};

export const loadThreadChats = async (
  threadContentId: number
): Promise<ThreadMessage[]> => {
  const response = await caller.get(
    `${BASE_THREAD_URL}/chat/${threadContentId}`
  );
  const data = response.data;
  return data.chats.map((chat: any) => ({
    chatId: chat.id,
    userQuestion: chat.user_question,
    aiResponse: chat.ai_answer,
  }));
};

export const streamAiAnswer = async function* (
  threadContentId: number,
  request: BaseLLMRequest
): AsyncGenerator<ThreadMessage, void> {
  const url = `${BASE_THREAD_URL}/${threadContentId}/chats`;
  const body = req(request);
  for await (const message of postStream(url, body)) {
    yield message;
  }
};

export const stopChat = async (threadContentId: number) => {
  const url = `${BASE_THREAD_URL}/${threadContentId}/chats/stop`;
  const response = await caller.post(url);
  return response.data;
};
