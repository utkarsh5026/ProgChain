/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { Quiz, QuizSetupValues, Question, CompletionStatus } from "./type";
import { generateQuiz } from "./api";

export enum QuestionStatus {
  NOT_STARTED = "not_started",
  LEFT_FOR_REVIEW = "left_for_review",
  COMPLETED = "completed",
  SKIPPED = "skipped",
}

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

/**
 * Parses a category string by capitalizing each word and replacing underscores with spaces.
 * @param {string} category - The category string to parse.
 * @returns {string} The parsed category string.
 */
export const parseCategory = (category: string) => {
  const parts = category.toLowerCase().split("_");
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

/**
 * Parses the quiz response from the API into the Quiz format used by the application.
 * @param {any} response - The raw response from the API.
 * @returns {Quiz} The parsed Quiz object.
 */
const parseQuiz = (response: any): Quiz => {
  const questions = response.questions;
  let id = 0;
  const parsedQuestions = questions.map((question: any) => ({
    id: id++,
    text: question["question"],
    answers: question["options"],
    level: question["difficulty"],
    type: question["question_type"],
    correctAnswers: question["correct_answers"],
    category: question["category"],
    status: "not_started" as CompletionStatus,
    selectedOptions: [],
  })) as Question[];

  console.log("parsedQuestions", parsedQuestions);

  return {
    topic: response["topic"],
    instructions: response["instructions"],
    questions: parsedQuestions,
  };
};

/**
 * Async thunk for generating a quiz.
 * It calls the generateQuiz API function and then parses the response.
 */
export const generateQuizThunk = createAsyncThunk(
  "quiz/generateQuiz",
  async (values: QuizSetupValues) => {
    const data = await generateQuiz(values);
    return parseQuiz(data);
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
    changeQuestionStatus: (
      state,
      action: PayloadAction<{ questionIdx: number; status: CompletionStatus }>
    ) => {
      const { questionIdx, status } = action.payload;
      if (state.quiz && state.quiz.questions[questionIdx])
        state.quiz.questions[questionIdx].status = status;
    },
    changeSelectedAnswers: (
      state,
      action: PayloadAction<{ questionIdx: number; answers: number[] }>
    ) => {
      const { questionIdx, answers } = action.payload;
      if (state.quiz && state.quiz.questions[questionIdx])
        state.quiz.questions[questionIdx].selectedOptions = answers;
    },
    markQuestionAsNotCompleted: (state, action: PayloadAction<number>) => {
      const questionIdx = action.payload;
      if (state.quiz && state.quiz.questions[questionIdx]) {
        state.quiz.questions[questionIdx].status = "not_started";
        state.quiz.questions[questionIdx].selectedOptions = [];
      }
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

export const {
  generateQuizStart,
  generateQuizSuccess,
  changeQuestionStatus,
  changeSelectedAnswers,
  markQuestionAsNotCompleted,
} = quizSlice.actions;

export default quizSlice.reducer;
