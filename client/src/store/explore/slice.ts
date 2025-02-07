import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Question, QuestionRequest, TopicRequest } from "./type";
import { exploreTopic, askQuestion } from "./api";
import { type Operation, op } from "@/base";

interface ExploreState {
  currentChatId: number | null;
  rootQuestion: Question | null;
  loading: Operation;
  error: string | null;
  currentPath: string[];
  questMap: Record<string, Question>;
  currentQuestion: Question | null;
}

const initialState: ExploreState = {
  rootQuestion: null,
  loading: op(null),
  error: null,
  currentPath: [],
  questMap: {},
  currentQuestion: null,
  currentChatId: null,
};

export const fetchQuestionThunk = createAsyncThunk(
  "explore/fetchQuestion",
  async (
    { question, model, extraInstructions }: TopicRequest,
    { dispatch }
  ) => {
    const generator = exploreTopic(question, model, extraInstructions);
    let accumulatedText = "";
    let lastUpdateTime = Date.now();
    const UPDATE_INTERVAL = 100; // Update every 100ms

    for await (const chunk of generator) {
      if (chunk.startsWith("chatID:")) {
        const chatId = chunk.split(":")[1];
        dispatch(setCurrentChatId(parseInt(chatId)));
        continue;
      }
      accumulatedText += chunk;

      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
        dispatch(updateCurrentExplanation(accumulatedText));
        lastUpdateTime = currentTime;
      }
    }
    // Final update to ensure we don't miss the last chunks
    dispatch(updateCurrentExplanation(accumulatedText));
  }
);

export const askQuestionThunk = createAsyncThunk(
  "explore/askQuestion",
  async (questionRequest: QuestionRequest, { dispatch }) => {
    const generator = askQuestion(questionRequest);
    let accumulatedText = "";
    let lastUpdateTime = Date.now();
    const UPDATE_INTERVAL = 100; // Update every 100ms

    for await (const chunk of generator) {
      accumulatedText += chunk;

      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
        dispatch(updateCurrentExplanation(accumulatedText));
        lastUpdateTime = currentTime;
      }
    }
    // Final update to ensure we don't miss the last chunks
    dispatch(updateCurrentExplanation(accumulatedText));
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    fetchQuestionStart: (state, action: PayloadAction<string>) => {
      state.loading = op("pending");
      const currId = Date.now().toPrecision().toString();

      if (state.currentQuestion !== null) {
        state.currentQuestion.followUpQuestionIDs.push(currId);
      }

      state.currentQuestion = {
        id: currId,
        text: action.payload,
        explanation: "",
        relatedQuestionIDs: [],
        followUpQuestionIDs: [],
      };

      if (state.rootQuestion === null)
        state.rootQuestion = state.currentQuestion;
      state.questMap[currId] = state.currentQuestion;
      state.currentPath = [...state.currentPath, currId];
    },
    resetExplore: (state) => {
      state.rootQuestion = null;
      state.currentPath = [];
      state.questMap = {};
      state.currentQuestion = null;
    },
    updateCurrentExplanation: (state, action: PayloadAction<string>) => {
      if (state.currentQuestion) {
        state.currentQuestion.explanation = action.payload;
        state.questMap[state.currentQuestion.id] = state.currentQuestion;
      }
    },
    setCurrentChatId: (state, action: PayloadAction<number>) => {
      state.currentChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestionThunk.pending, (state) => {
      state.loading = op("pending");
    });
    builder.addCase(fetchQuestionThunk.fulfilled, (state) => {
      state.loading = op("fulfilled");
    });

    builder.addCase(fetchQuestionThunk.rejected, (state, action) => {
      state.loading = op(
        "rejected",
        action.error.message ?? "Failed to fetch question"
      );
    });
  },
});

export const {
  fetchQuestionStart,
  resetExplore,
  updateCurrentExplanation,
  setCurrentChatId,
} = exploreSlice.actions;
export default exploreSlice.reducer;
