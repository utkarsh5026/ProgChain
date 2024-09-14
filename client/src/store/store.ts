import { configureStore } from "@reduxjs/toolkit";
import topicsSlice from "./topics/slice";
import questionSlice from "./interview/question";
import quizSlice from "./quiz/slice";

export const store = configureStore({
  reducer: {
    topics: topicsSlice,
    questions: questionSlice,
    quiz: quizSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
