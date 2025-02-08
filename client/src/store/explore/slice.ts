import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Question, QuestionRequest, TopicRequest } from "./type";
import { exploreTopic, askQuestion, loadChat } from "./api";
import { type Operation, op } from "@/base";

interface ExploreState {
  currentChatId: number | null;
  rootQuestion: Question | null;
  loading: Operation;
  currentPath: number[];
  questMap: Record<number, Question>;
  currentQuestion: Question | null;
}

const initialState: ExploreState = {
  rootQuestion: null,
  loading: op(null),
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
      if (chunk.includes("chat_message_id:")) {
        console.log(chunk);
        const chatId = chunk.split(":")[1];
        dispatch(updateCurrentMessageId(parseInt(chatId.trim())));
        continue;
      }
      accumulatedText += chunk;

      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
        dispatch(
          updateCurrentExplanation({
            text: accumulatedText,
            generating: op("pending"),
          })
        );
        lastUpdateTime = currentTime;
      }
    }
    dispatch(
      updateCurrentExplanation({
        text: accumulatedText,
        generating: op("fulfilled"),
      })
    );
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
      if (chunk.includes("chat_message_id:")) {
        console.log(chunk);
        const chatId = chunk.split(":")[1];
        dispatch(updateCurrentMessageId(parseInt(chatId.trim())));
        continue;
      }
      accumulatedText += chunk;

      const currentTime = Date.now();
      if (currentTime - lastUpdateTime >= UPDATE_INTERVAL) {
        dispatch(
          updateCurrentExplanation({
            text: accumulatedText,
            generating: op("pending"),
          })
        );
        lastUpdateTime = currentTime;
      }
    }
    // Final update to ensure we don't miss the last chunks
    dispatch(
      updateCurrentExplanation({
        text: accumulatedText,
        generating: op("fulfilled"),
      })
    );
  }
);

export const loadChatThunk = createAsyncThunk(
  "explore/loadChat",
  async (chatId: number) => {
    const chat = await loadChat(chatId);
    console.log(chat);
    return {
      chatId,
      questions: chat,
    };
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    fetchQuestionStart: (state, action: PayloadAction<string>) => {
      state.loading = op("pending");
      const currId = Date.now();

      state.currentQuestion = {
        id: currId,
        text: action.payload,
        explanation: "",
        generating: op("pending"),
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
      state.loading = op(null);
    },
    updateCurrentExplanation: (
      state,
      action: PayloadAction<{
        text: string;
        generating: Operation;
      }>
    ) => {
      if (state.currentQuestion) {
        state.currentQuestion.explanation = action.payload.text;
        state.currentQuestion.generating = action.payload.generating;
        state.questMap[state.currentQuestion.id] = state.currentQuestion;
      }
    },

    updateCurrentMessageId: (state, action: PayloadAction<number>) => {
      if (!state.currentQuestion) return;
      const newMsgId = action.payload;
      const currentMsgId = state.currentQuestion.id;
      if (currentMsgId === newMsgId) return;

      state.questMap[newMsgId] = {
        ...state.questMap[currentMsgId],
        id: newMsgId,
      };

      delete state.questMap[currentMsgId];
      const oldIdx = state.currentPath.indexOf(currentMsgId);
      state.currentPath[oldIdx] = newMsgId;

      if (state.rootQuestion?.id === currentMsgId) {
        state.rootQuestion = state.questMap[newMsgId];
      }
      state.currentQuestion = state.questMap[newMsgId];
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
    builder.addCase(loadChatThunk.pending, (state) => {
      state.loading = op("pending");
    });
    builder.addCase(loadChatThunk.fulfilled, (state, action) => {
      state.loading = op("fulfilled");
      const { chatId, questions } = action.payload;
      state.questMap = questions.reduce((acc, question) => {
        acc[question.id] = question;
        return acc;
      }, {} as Record<number, Question>);
      state.currentChatId = chatId;
      state.currentPath = questions.map((question) => question.id);

      const questionCnt = questions.length;
      const rootQuestion = questions[0];
      const currentQuestion = questions[questionCnt - 1];
      state.rootQuestion = rootQuestion;
      state.currentQuestion = currentQuestion;
    });
  },
});

export const {
  fetchQuestionStart,
  resetExplore,
  updateCurrentExplanation,
  updateCurrentMessageId,
} = exploreSlice.actions;
export default exploreSlice.reducer;
