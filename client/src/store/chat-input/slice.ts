import { Model } from "@/config/config";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Content } from "./type";
import type { PromptType } from "@/config/prompt";

type ChatInput = {
  text: string;
  pastedContents: Content[];
  model: Model;
  promptType: PromptType;
};

const initialState: ChatInput = {
  text: "",
  pastedContents: [],
  model: "gpt-4o-mini",
  promptType: "teacher",
};

const chatInputSlice = createSlice({
  name: "chatInput",
  initialState,
  reducers: {
    selectModel: (state, action: PayloadAction<Model>) => {
      state.model = action.payload;
    },
    setText: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
    },
    setPastedContents: (state, action: PayloadAction<Content[]>) => {
      state.pastedContents = action.payload;
    },

    setPromptType: (state, action: PayloadAction<PromptType>) => {
      state.promptType = action.payload;
    },
    reset: (state) => {
      state.text = "";
      state.pastedContents = [];
    },
  },
});

export const { selectModel, setText, setPastedContents, setPromptType, reset } =
  chatInputSlice.actions;

export default chatInputSlice.reducer;
