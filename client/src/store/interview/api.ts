import axios from "axios";
import { postStream } from "@/api/stream";

const BASE_URL = "http://localhost:8000/interview";

export const getInterviewQuestions = async function* (
  topic: string,
  context: string
) {
  const url = `${BASE_URL}/questions`;
  const body = { topic, context };

  for await (const chunk of postStream(url, body)) {
    yield chunk;
  }
};

export const getInterviewAnswer = async (question: string) => {
  const response = await axios.post(`${BASE_URL}/answer`, { question });
  return response.data;
};
