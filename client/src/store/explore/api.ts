import { streamText } from "@/api/stream";
import { API_BASE_URL } from "@/api/caller";
import type { Model } from "@/config/config";

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
