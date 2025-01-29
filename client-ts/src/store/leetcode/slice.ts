import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { ProblemList, ProblemFilters } from "./type";
import { fetchProblems } from "./api";

interface ProblemListState {
  problems: ProblemList | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProblemListState = {
  problems: null,
  loading: false,
  error: null,
};

export const fetchProblemsThunk = createAsyncThunk(
  "problemList/fetchProblems",
  async ({ page, limit }: ProblemFilters) => {
    const problems = await fetchProblems(page, limit);
    return problems;
  }
);

const problemListSlice = createSlice({
  name: "problemList",
  initialState,
  reducers: {
    setProblemList: (state, action: PayloadAction<ProblemList>) => {
      state.problems = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProblemsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProblemsThunk.fulfilled, (state, action) => {
      state.problems = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchProblemsThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to fetch problems";
    });
  },
});

export const { setProblemList } = problemListSlice.actions;
export default problemListSlice.reducer;
