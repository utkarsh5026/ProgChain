import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { getChatHistory } from "./api";
import type { ChatBasic } from "./type";

export const fetchChatHistoryThunk = createAsyncThunk(
  "chats/fetchChatHistory",
  async ({ limit, page }: { limit: number; page: number }) => {
    const data = await getChatHistory(limit, page);
    return data.map((ch: any) => {
      return {
        topic: ch.chat_topic,
        createdAt: ch.created_at,
        updatedAt: ch.updated_at,
        id: ch.chat_id,
      };
    });
  }
);

interface ChatsState {
  chats: ChatBasic[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatsState = {
  chats: [],
  loading: false,
  error: null,
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    deleteChat: (state, action: PayloadAction<number>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchChatHistoryThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      fetchChatHistoryThunk.fulfilled,
      (state, action: PayloadAction<ChatBasic[]>) => {
        state.loading = false;
        state.chats = action.payload;
      }
    );

    builder.addCase(fetchChatHistoryThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to fetch chat history";
    });
  },
});

export const { deleteChat } = chatsSlice.actions;
export default chatsSlice.reducer;
