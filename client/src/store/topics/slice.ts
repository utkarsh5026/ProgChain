import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { generateTopics } from "./api";
import type { TopicConcepts } from "./types";

export const DELIMITER = "||";

interface TopicState {
  concepts: Record<string, TopicConcepts>;
  loading: boolean;
  error: string | null;
  currentTopic: string | null;
}

const initialState: TopicState = {
  concepts: {},
  loading: false,
  error: null,
  currentTopic: "Python",
};

export const fetchGeneratedTopics = createAsyncThunk(
  "topics/fetchGeneratedTopics",
  async (
    { mainTopic, context }: { mainTopic: string; context: string[] },
    { rejectWithValue }
  ) => {
    try {
      const topics = (await generateTopics(
        mainTopic,
        context
      )) as TopicConcepts;
      return { mainTopic, topics, context };
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const createTopicKey = (mainTopic: string, context: string[]) => {
  return `${mainTopic}${DELIMITER}${context.join(DELIMITER)}`;
};

const topicsSlice = createSlice({
  name: "topics",
  initialState,
  reducers: {
    addTopic: (
      state,
      action: PayloadAction<{ topic: string; concepts: TopicConcepts }>
    ) => {
      const { topic, concepts } = action.payload;
      state.concepts[topic] = concepts;
    },
    setCurrentTopic: (state, action: PayloadAction<string>) => {
      state.currentTopic = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGeneratedTopics.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchGeneratedTopics.fulfilled, (state, action) => {
      const { mainTopic, topics, context } = action.payload;
      state.loading = false;
      const topicKey = createTopicKey(mainTopic, context);
      state.concepts[topicKey] = topics;
      state.currentTopic = topicKey;
    });
    builder.addCase(fetchGeneratedTopics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Unknown error";
    });
  },
});

export const { addTopic, setCurrentTopic } = topicsSlice.actions;

export default topicsSlice.reducer;
