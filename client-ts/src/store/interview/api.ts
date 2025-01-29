import axios from "axios";

const BASE_URL = "http://localhost:8000/interview";

export const getInterviewQuestions = async (topic: string, context: string) => {
  const response = await axios.post(`${BASE_URL}/`, { topic, context });
  return response.data;
};

export const getInterviewAnswer = async (question: string) => {
  const response = await axios.post(`${BASE_URL}/answer`, { question });
  return response.data;
};
