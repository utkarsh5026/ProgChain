import caller from "../../api/caller";
import type { QuizSetupValues } from "./type";

const QUIZ_API = "/quiz";

export const generateQuiz = async (values: QuizSetupValues) => {
  const response = await caller.post(`${QUIZ_API}/generate`, values);
  return response.data;
};
