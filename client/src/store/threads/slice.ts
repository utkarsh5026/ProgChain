import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Thread, ThreadTopicRequest, LearningContent } from "./types";
import { getThreadContent } from "./api";

interface ThreadState {
  thread: Thread | null;
  loading: boolean;
  error: string | null;
}

export const fetchThreadContentThunk = createAsyncThunk(
  "threads/fetchThreadContent",
  async (request: ThreadTopicRequest, { dispatch }) => {
    const generator = getThreadContent(request);
    for await (const content of generator) {
      console.log(content);
      dispatch(appendContent(content));
    }
  }
);

const initialState: ThreadState = {
  thread: null,
  loading: false,
  error: null,
};

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    intiThread(state, action: PayloadAction<string>) {
      state.thread = {
        mainTopic: action.payload,
        currentIdx: 0,
        content: [],
      };
    },
    appendContent(state, action: PayloadAction<LearningContent>) {
      if (state.thread) {
        state.loading = false;
        state.thread.content.push(action.payload);
        state.thread.currentIdx += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchThreadContentThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchThreadContentThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchThreadContentThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? null;
    });
  },
});

export const { intiThread, appendContent } = threadsSlice.actions;

export default threadsSlice.reducer;
