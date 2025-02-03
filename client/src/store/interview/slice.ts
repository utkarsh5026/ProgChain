import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { DifficultyMap, RequestQuestion, TopicQuestions } from "./type";

import { getInterviewQuestions } from "./api";

export const fetchQuestionsThunk = createAsyncThunk(
  "interview/fetchQuestions",
  async (request: RequestQuestion, { dispatch, rejectWithValue }) => {
    try {
      const { topic, context } = request;
      const generator = getInterviewQuestions(topic, context);

      for await (const { topic, questions } of generator) {
        dispatch(
          questionSlice.actions.updateQuestions({
            topic,
            context,
            questions,
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

interface QuestionState {
  topicQuestions: Record<string, TopicQuestions>;
  currentTopic: string | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  currentTopic: null,
  topicQuestions: {},
  loading: false,
  error: null,
  generating: false,
};

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    updateQuestions: (
      state,
      action: PayloadAction<{
        topic: string;
        context: string;
        questions: DifficultyMap;
        rewrite?: boolean;
      }>
    ) => {
      const { topic, context, questions, rewrite } = action.payload;
      if (!state.topicQuestions[topic]) {
        state.topicQuestions[topic] = {
          topic,
          context,
          questions: new Map(),
        };
      }
      state.loading = false;

      const difficultyKeys = Array.from(questions.keys());
      for (const key of difficultyKeys) {
        if (!state.topicQuestions[topic].questions.has(key)) {
          state.topicQuestions[topic].questions.set(key, []);
        }

        const questionsOfDifficulty = questions.get(key) ?? [];

        if (rewrite) {
          state.topicQuestions[topic].questions.set(key, questionsOfDifficulty);
        } else {
          state.topicQuestions[topic].questions
            .get(key)
            ?.push(...questionsOfDifficulty);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state) => {
        state.loading = false;
        state.generating = false;
      })

      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.generating = false;
        state.error = action.error.message ?? "Failed to fetch questions";
      });
  },
});

export const { updateQuestions } = questionSlice.actions;

export default questionSlice.reducer;
