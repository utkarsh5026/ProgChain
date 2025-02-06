import { postStream } from "@/api/stream";
import type { LearningContent } from "./types";
import { API_BASE_URL } from "@/api/caller";
import type { BaseLLMRequest } from "@/base";

const BASE_THREAD_URL = `${API_BASE_URL}/threads`;
const GENERATE_URL = `${BASE_THREAD_URL}/generate`;
const CREATE_URL = `${BASE_THREAD_URL}/create`;

export type ThreadCreateRequest = BaseLLMRequest & {
  topic: string;
};

export type ThreadGenerateRequest = BaseLLMRequest & {
  threadID: number;
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
