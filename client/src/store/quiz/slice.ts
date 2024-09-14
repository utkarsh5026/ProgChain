/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { Quiz, QuizSetupValues, Question } from "./type";
import { generateQuiz } from "./api";

interface QuizState {
  quiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quiz: null,
  loading: false,
  error: null,
};

const parseQuiz = (response: any): Quiz => {
  console.log(response);
  const questions = response.questions;
  const parsedQuestions = questions.map((question: any) => ({
    text: question["question"],
    answers: question["options"],
    level: question["difficulty"],
    type: question["question_type"],
    correctAnswers: question["correct_answers"],
    category: question["category"],
  })) as Question[];

  console.log("parsedQuestions", parsedQuestions);

  return {
    topic: response["topic"],
    instructions: response["instructions"],
    questions: parsedQuestions,
  };
};

export const generateQuizThunk = createAsyncThunk(
  "quiz/generateQuiz",
  async (values: QuizSetupValues) => {
    const response = await generateQuiz(values);
    return parseQuiz(response);
  }
);

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    generateQuizStart: (state) => {
      state.loading = true;
    },
    generateQuizSuccess: (state, action: PayloadAction<Quiz>) => {
      state.quiz = action.payload;
      state.loading = false;
      state.error = null;
    },
    generateQuizFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(generateQuizThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(generateQuizThunk.fulfilled, (state, action) => {
      console.log("action.payload", action.payload);
      state.quiz = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(generateQuizThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to generate quiz";
    });
  },
});

export const { generateQuizStart, generateQuizSuccess } = quizSlice.actions;

export default quizSlice.reducer;
