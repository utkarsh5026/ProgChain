import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { generateTopics } from "./api";
import type { TopicConcepts, TopicsRequest } from "./types";

export const DELIMITER = ">";

interface TopicState {
  conversationId: string | null;
  topics: Record<string, TopicConcepts>;
  loading: boolean;
  error: string | null;
  currentTopic: string | null;
  generating: boolean;
}

const initialState: TopicState = {
  conversationId: null,
  topics: {},
  loading: false,
  error: null,
  currentTopic: null,
  generating: false,
};

/**
 * Async thunk to fetch generated topics.
 * @param mainTopic - The main topic to generate sub-topics for.
 * @param context - An array of context strings to provide additional information for topic generation.
 * @returns An object containing the main topic, generated topics, and context.
 */
export const fetchGeneratedTopics = createAsyncThunk(
  "topics/fetchGeneratedTopics",
  async (
    { conversationId, topicPath, model }: TopicsRequest,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const topicsGenerator = generateTopics(model, topicPath, conversationId);
      let firstResponse = true;
      let lastResponse;

      for await (const response of topicsGenerator) {
        if (firstResponse) {
          dispatch(
            topicsSlice.actions.setInitialTopicState({
              conversationId: response.conversation_id,
              topicPath,
              topics: response.available_topics,
            })
          );
          firstResponse = false;
        } else {
          dispatch(
            topicsSlice.actions.updateTopics({
              topicPath,
              topics: response.available_topics,
            })
          );
        }
        lastResponse = response;
      }

      return {
        conversationId: lastResponse.conversation_id,
        topicPath,
        topics: lastResponse.available_topics,
      };
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("An unknown error occurred");
    }
  }
);

/**
 * Creates a unique key for a topic based on the main topic and context.
 * @param mainTopic - The main topic.
 * @param context - An array of context strings.
 * @returns A string key combining the main topic and context.
 */
export const createTopicKey = (mainTopic: string, context: string[]) => {
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
      state.topics[topic] = concepts;
    },
    setCurrentTopic: (state, action: PayloadAction<string>) => {
      state.currentTopic = action.payload;
    },
    setInitialTopicState: (
      state,
      action: PayloadAction<{
        conversationId: string;
        topicPath: string;
        topics: TopicConcepts;
      }>
    ) => {
      const { conversationId, topicPath, topics } = action.payload;
      state.loading = false;
      state.topics[topicPath] = topics;
      state.currentTopic = topicPath;
      state.conversationId = conversationId;
    },
    updateTopics: (
      state,
      action: PayloadAction<{
        topicPath: string;
        topics: TopicConcepts;
      }>
    ) => {
      const { topicPath, topics } = action.payload;
      state.topics[topicPath] = {
        ...state.topics[topicPath],
        ...topics,
      };
      state.loading = false;
    },
    setSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGeneratedTopics.pending, (state) => {
      state.loading = true;
      state.generating = true;
      state.error = null;
    });

    builder.addCase(fetchGeneratedTopics.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchGeneratedTopics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Unknown error";
      state.generating = false;
    });
  },
});

export const {
  addTopic,
  setCurrentTopic,
  setInitialTopicState,
  updateTopics,
  setSuccess,
  setError,
} = topicsSlice.actions;

export default topicsSlice.reducer;
