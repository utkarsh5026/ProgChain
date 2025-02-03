import type { Model } from "@/config/config";

const API_BASE_URL = "http://localhost:8000/topics";
/**
 * Generates topics based on a main topic and optional context.
 *
 * @async
 * @function generateTopics
 * @param {string} mainTopic - The primary topic for which to generate related topics.
 * @param {string[]} [context=[]] - Optional array of context strings to provide additional information for topic generation.
 * @returns {Promise<Object>} A promise that resolves to the generated topics.
 * @throws {Error} If the API request fails.
 *
 * @example
 * const topics = await generateTopics('JavaScript', ['Web Development', 'Frontend']);
 */
export const generateTopics = async function* (
  model: Model,
  topicPath: string,
  conversationId: string | null
) {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      topic_path: topicPath,
      model: model,
      conversation_id: conversationId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No reader available");
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    let chunk = decoder.decode(value);
    if (chunk.startsWith("data:")) chunk = chunk.slice(5);

    chunk = chunk.trim();
    console.log(chunk);
    try {
      const json = JSON.parse(chunk);
      yield json;
    } catch (e) {
      console.error("Failed to parse SSE data:", e);
    }
  }
};
