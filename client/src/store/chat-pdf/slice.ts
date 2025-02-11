import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Pdf } from "./types";
import { Operation, op } from "@/base";

interface PdfState {
  pdf: Pdf | null;
  pdfLoading: Operation;
  darkMode: boolean;
  scale: number;
}

const initialState: PdfState = {
  pdf: null,
  pdfLoading: op(null),
  darkMode: false,
  scale: 1,
};

const pdfSlice = createSlice({
  name: "pdf",
  initialState,
  reducers: {
    setPdf(state, action: PayloadAction<Pdf>) {
      state.pdf = action.payload;
    },
    setPdfLoading(state, action: PayloadAction<Operation>) {
      state.pdfLoading = action.payload;
    },
    setIsDarkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
    // Optional: A reset action to restore the default state
    resetPdfState(state) {
      state.pdf = null;
      state.pdfLoading = op(null);
      state.darkMode = false;
    },
    setScale(state, action: PayloadAction<number>) {
      state.scale = action.payload;
    },
  },
});

export const { setPdf, setIsDarkMode, resetPdfState, setPdfLoading, setScale } =
  pdfSlice.actions;

export default pdfSlice.reducer;
