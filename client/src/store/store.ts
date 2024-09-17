import { configureStore } from "@reduxjs/toolkit";
import topicsSlice from "./topics/slice";
import questionSlice from "./interview/slice";
import quizSlice from "./quiz/slice";
import exploreSlice from "./explore/slice";

export const store = configureStore({
  reducer: {
    topics: topicsSlice,
    questions: questionSlice,
    quiz: quizSlice,
    explore: exploreSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
