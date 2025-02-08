import { createAction } from "@reduxjs/toolkit";

export const onNewThreadContents = createAction<number[]>(
  "threadChat/onNewThreadContents"
);
