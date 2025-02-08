import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ThreadChatContent, ThreadMessage } from "./types";
import { type Operation, op } from "@/base";
import { onNewThreadContents } from "./actions";
import { streamAiAnswer, loadThreadChats, type ThreadChatRequest } from "./api";

export const streamAiAnswerThunk = createAsyncThunk(
  "threadChat/streamAiAnswer",
  async (request: ThreadChatRequest, { dispatch }) => {
    const generator = streamAiAnswer(request.threadContentId, request);

    let content = "";
    for await (const message of generator) {
      content += message.aiResponse;
      dispatch(
        addMessageForThreadContent({
          threadContentId: request.threadContentId,
          message: content,
        })
      );
    }
    return content;
  }
);

export const loadThreadChatsThunk = createAsyncThunk(
  "threadChat/loadThreadChats",
  async (threadContentId: number, { dispatch }) => {
    const messages = await loadThreadChats(threadContentId);
    dispatch(addMessages({ threadContentId, messages }));
  }
);

export interface ThreadChatState {
  chats: Record<number, ThreadChatContent>;
  loading: Record<number, Operation>;
}

const initialState: ThreadChatState = {
  chats: {},
  loading: {},
};

const threadChatSlice = createSlice({
  name: "threadChat",
  initialState,
  reducers: {
    addMessageForThreadContent: (
      state,
      action: PayloadAction<{
        threadContentId: number;
        message: string;
      }>
    ) => {
      const { threadContentId, message } = action.payload;
      if (!state.chats[threadContentId]?.chats?.length) {
        throw new Error("Thread content not found");
      }
      const length = state.chats[threadContentId].chats.length;
      const chats = state.chats[threadContentId].chats;
      chats[length - 1].aiResponse = message;
      state.chats[threadContentId].chats = chats;
    },
    beforeStreamAiAnswer: (state, action) => {
      const { threadContentId, message } = action.payload;
      if (!state.chats[threadContentId]) {
        state.chats[threadContentId] = {
          threadContentId,
          chats: [],
        };
      }
      const threadMessage = {
        chatId: Date.now(),
        userQuestion: message.userQuestion,
        aiResponse: "",
        loading: op(null),
      };
      state.chats[threadContentId].chats.push(threadMessage);
    },
    addMessages(
      state,
      action: PayloadAction<{
        threadContentId: number;
        messages: ThreadMessage[];
      }>
    ) {
      const { threadContentId, messages } = action.payload;
      if (!state.chats[threadContentId]) {
        state.chats[threadContentId] = {
          threadContentId,
          chats: [],
        };
      }

      const currChatIds = new Set(
        state.chats[threadContentId].chats.map((chat) => chat.chatId)
      );
      const messagesToAdd = messages.filter(
        (msg) => !currChatIds.has(msg.chatId)
      );
      state.chats[threadContentId].chats.push(...messagesToAdd);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(onNewThreadContents, (state, action) => {
      const threadContentIds = action.payload;
      threadContentIds.forEach((threadContentId) => {
        state.chats[threadContentId] = {
          threadContentId,
          chats: [],
        };
        state.loading[threadContentId] = op(null);
      });
    });
    builder.addCase(streamAiAnswerThunk.pending, (state, action) => {
      const { threadContentId } = action.meta.arg;
      state.loading[threadContentId] = op("pending");
    });
    builder.addCase(streamAiAnswerThunk.fulfilled, (state, action) => {
      const { threadContentId } = action.meta.arg;
      state.loading[threadContentId] = op("fulfilled");
    });
    builder.addCase(streamAiAnswerThunk.rejected, (state, action) => {
      const { threadContentId } = action.meta.arg;
      state.loading[threadContentId] = op("rejected");
    });
    builder.addCase(loadThreadChatsThunk.pending, (state, action) => {
      const threadContentId = action.meta.arg;
      state.loading[threadContentId] = op("pending");
    });
    builder.addCase(loadThreadChatsThunk.fulfilled, (state, action) => {
      const threadContentId = action.meta.arg;
      state.loading[threadContentId] = op("fulfilled");
    });
    builder.addCase(loadThreadChatsThunk.rejected, (state, action) => {
      const threadContentId = action.meta.arg;
      state.loading[threadContentId] = op("rejected");
    });
  },
});

export const { addMessageForThreadContent, beforeStreamAiAnswer, addMessages } =
  threadChatSlice.actions;

export default threadChatSlice.reducer;
