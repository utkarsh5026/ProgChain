import { configureStore } from "@reduxjs/toolkit";
import topicsSlice from "./topics/slice";
import questionSlice from "./interview/slice";
import exploreSlice from "./explore/slice";
import problemListSlice from "./leetcode/slice";
import problemSlice from "./leetcode/problemSlice";
import chatsSlice from "./explore/chatsSlice";
import threadsSlice from "./threads/slice";
import chatInputSlice from "./chat-input/slice";
import threadChatSlice from "./threads/threadChatSlice";
import chatPdfSlice from "./chat-pdf/slice";

export const store = configureStore({
  reducer: {
    topics: topicsSlice,
    questions: questionSlice,
    explore: exploreSlice,
    problemList: problemListSlice,
    problem: problemSlice,
    exploreChats: chatsSlice,
    threads: threadsSlice,
    threadChat: threadChatSlice,
    chatInput: chatInputSlice,
    chatPdf: chatPdfSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
