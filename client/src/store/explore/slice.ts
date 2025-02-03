import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Question, ResponseQuestion } from "./type";
import { exploreTopic } from "./api";

interface ExploreState {
  rootQuestion: Question | null;
  loading: boolean;
  error: string | null;
  currentPath: string[];
  questMap: Record<string, Question>;
  currentQuestion: Question | null;
}

const initialState: ExploreState = {
  rootQuestion: null,
  loading: false,
  error: null,
  currentPath: [],
  questMap: {},
  currentQuestion: null,
};

export const fetchQuestionThunk = createAsyncThunk(
  "explore/fetchQuestion",
  async (question: string, { dispatch }) => {
    const generator = exploreTopic(question);
    let accumulatedText = "";

    for await (const chunk of generator) {
      accumulatedText += chunk;
      dispatch(updateCurrentExplanation(accumulatedText));
    }

    const response: ResponseQuestion = JSON.parse(accumulatedText);
    return response;
  }
);

const exploreSlice = createSlice({
  name: "explore",
  initialState,
  reducers: {
    fetchQuestionStart: (state, action: PayloadAction<string>) => {
      state.loading = true;
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchQuestionThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchQuestionThunk.fulfilled,
      (state, action: PayloadAction<ResponseQuestion>) => {
        const { explanation, follow_up_questions } = action.payload;
        state.loading = false;

        if (state.currentQuestion !== null) {
          state.currentQuestion = {
            ...state.currentQuestion,
            explanation,
            relatedQuestionIDs: follow_up_questions,
          };
          const id = state.currentQuestion.id;
          state.questMap[id] = state.currentQuestion;
        }
      }
    );
    builder.addCase(fetchQuestionThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch question";
    });
  },
});

export const { fetchQuestionStart, resetExplore, updateCurrentExplanation } =
  exploreSlice.actions;
export default exploreSlice.reducer;
