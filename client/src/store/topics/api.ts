import type { Model } from "@/config/config";
import { postStream } from "@/api/stream";
const API_BASE_URL = "http://localhost:8000/topics";

/**
 * Streams generated topics from the server.
 *
 * This async generator function sends a POST request to the topics generation API
 * using the provided model, topic path, and optional conversation ID. It utilizes
 * the postStream helper to connect to a server-sent events stream and yields topics
 * as they are received.
 *
 * @param {Model} model - The identifier of the model to be used for generating topics.
 * @param {string} topicPath - The topic path that specifies which topics to generate.
 * @param {string | null} conversationId - An optional identifier for the conversation, allowing
 *                                         requests to be correlated.
 * @returns {AsyncGenerator<any, void, unknown>} An async generator yielding topics from the stream.
 *
 * @example
 * // Usage example:
 * for await (const topic of generateTopics(model, "technology", "conv123")) {
 *   console.log("Received topic:", topic);
 * }
 */
export const generateTopics = async function* (
  model: Model,
  topicPath: string,
  conversationId: string | null
) {
  const url = `${API_BASE_URL}/generate`;
  const postBody = {
    topic_path: topicPath,
    model: model,
    conversation_id: conversationId,
  };

  for await (const topic of postStream(url, postBody)) {
    yield topic;
  }
};
