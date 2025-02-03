import { streamText } from "@/api/stream";
import { API_BASE_URL } from "@/api/caller";

export const exploreTopic = async function* (topic: string) {
  const url = `${API_BASE_URL}/explore/topic`;
  const postBody = {
    topic: topic,
  };

  for await (const chunk of streamText(url, postBody)) {
    yield chunk;
  }
};
