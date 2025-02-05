import { postStream } from "@/api/stream";
import type { ThreadTopicRequest, LearningContent } from "./types";
import { API_BASE_URL } from "@/api/caller";

export const getThreadContent = async function* (
  request: ThreadTopicRequest
): AsyncGenerator<LearningContent, void> {
  const url = `${API_BASE_URL}/threads/generate`;
  const body = {
    topic: request.topic,
    current_idx: request.currentIdx,
  };

  for await (const content of postStream(url, body)) {
    const contentStr = content.topic_content;
    const id = content.current_idx;
    yield {
      id,
      content: contentStr,
    };
  }
};
