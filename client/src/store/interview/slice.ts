import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RequestQuestion, ResponseQuestion } from "./type";
import { getInterviewQuestions } from "./api";

const fetchQuestionsThunk = createAsyncThunk(
  "interview/fetchQuestions",
  async (request: RequestQuestion) => {
    const { topic, context } = request;
    const response = await getInterviewQuestions(topic, context);
    const data: ResponseQuestion = response.data;
    return data;
  }
);

interface QuestionState {
  topicQuestions: Record<string, ResponseQuestion[]>;
  currentTopic: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  currentTopic: null,
  topicQuestions: {},
  loading: false,
  error: null,
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { topic, context, questions } = action.payload;

        if (!state.topicQuestions[topic]) {
          state.topicQuestions[topic] = [];
        }

        state.topicQuestions[topic].push({
          topic,
          context,
          questions,
        });
      })
      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch questions";
      });
  },
});

export { fetchQuestionsThunk };
export default questionSlice.reducer;
