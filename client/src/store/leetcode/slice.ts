import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { ProblemList, ProblemFilters } from "./type";
import { fetchProblems, fetchInfo } from "./api";

interface ProblemListState {
  problems: ProblemList | null;
  loading: boolean;
  error: string | null;
  tags: string[];
  pageSize: number;
  problemCnt: number;
}

const initialState: ProblemListState = {
  problems: null,
  loading: false,
  error: null,
  tags: [],
  pageSize: 40,
  problemCnt: 0,
};

export const fetchProblemsThunk = createAsyncThunk(
  "problemList/fetchProblems",
  async ({ page, limit }: ProblemFilters) => {
    const problems = await fetchProblems(page, limit);
    return problems;
  }
);

export const fetchInfoThunk = createAsyncThunk(
  "problemList/fetchInfo",
  async () => {
    const info = await fetchInfo();
    return info;
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
    builder.addCase(fetchInfoThunk.fulfilled, (state, action) => {
      state.tags = action.payload.tags;
      state.pageSize = action.payload.page_size;
      state.problemCnt = action.payload.problem_cnt;
    });
  },
});

export const { setProblemList } = problemListSlice.actions;
export default problemListSlice.reducer;
