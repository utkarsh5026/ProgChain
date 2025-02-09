import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Thread, LearningContent } from "./types";
import {
  createThread,
  generateThread,
  fetchThread,
  type ThreadCreateRequest,
  type ThreadGenerateRequest,
} from "./api";
import { onNewThreadContents } from "./actions";
import { type Operation, op } from "@/base";

interface ThreadState {
  thread: Thread | null;
  creating: Operation;
  generating: Operation;
}

export const createThreadThunk = createAsyncThunk(
  "threads/createThread",
  async (request: ThreadCreateRequest, { dispatch }) => {
    const generator = createThread(request);
    let threadCreated = false;
    for await (const threadContent of generator) {
      const { threadID, content } = threadContent;
      if (!threadCreated) {
        dispatch(
          initThread({
            threadID,
            mainTopic: content.topic,
            currentIdx: 0,
            content: [],
          })
        );
        threadCreated = true;
      }
      dispatch(appendContent(content));
    }
  }
);

export const generateThreadThunk = createAsyncThunk(
  "threads/generateThread",
  async (request: ThreadGenerateRequest, { dispatch }) => {
    const generator = generateThread(request);
    for await (const content of generator) {
      dispatch(appendContent(content.content));
    }
  }
);

export const fetchThreadThunk = createAsyncThunk(
  "threads/fetchThread",
  async (threadID: number, { dispatch }) => {
    const thread = await fetchThread(threadID);
    const { contents } = thread;
    dispatch(
      initThread({
        threadID,
        mainTopic: contents[0].topic,
        currentIdx: 0,
        content: contents,
      })
    );
    dispatch(
      onNewThreadContents(contents.map((content) => parseInt(content.id)))
    );
  }
);

const initialState: ThreadState = {
  thread: null,
  creating: op(null),
  generating: op(null),
};

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    initThread(state, action: PayloadAction<Thread>) {
      state.thread = action.payload;
      state.creating = op("fulfilled");
    },
    appendContent(state, action: PayloadAction<LearningContent>) {
      if (state.thread) {
        state.thread.content.push(action.payload);
        state.thread.currentIdx += 1;
      }
    },
    resetThread(state) {
      state.thread = null;
      state.creating = op(null);
      state.generating = op(null);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createThreadThunk.pending, (state) => {
      state.creating = op("pending");
      state.generating = op("pending");
    });
    builder.addCase(createThreadThunk.fulfilled, (state) => {
      state.creating = op("fulfilled");
      state.generating = op("fulfilled");
    });
    builder.addCase(createThreadThunk.rejected, (state, action) => {
      state.creating = op("rejected", action.error.message ?? null);
    });

    builder.addCase(generateThreadThunk.pending, (state) => {
      state.generating = op("pending");
    });
    builder.addCase(generateThreadThunk.fulfilled, (state) => {
      state.generating = op("fulfilled");
    });
    builder.addCase(generateThreadThunk.rejected, (state, action) => {
      state.generating = op("rejected", action.error.message ?? null);
    });

    builder.addCase(fetchThreadThunk.pending, (state) => {
      state.creating = op("pending");
      state.generating = op("pending");
    });
    builder.addCase(fetchThreadThunk.fulfilled, (state) => {
      state.creating = op("fulfilled");
      state.generating = op("fulfilled");
    });
    builder.addCase(fetchThreadThunk.rejected, (state, action) => {
      state.creating = op("rejected", action.error.message ?? null);
      state.generating = op("rejected", action.error.message ?? null);
    });
  },
});

export const { initThread, appendContent, resetThread } = threadsSlice.actions;

export default threadsSlice.reducer;
