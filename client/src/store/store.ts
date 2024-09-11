import { configureStore } from "@reduxjs/toolkit";
import topicsSlice from "./topics/slice";

export const store = configureStore({
  reducer: {
    topics: topicsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
