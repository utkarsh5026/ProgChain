import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { ProblemList, ProblemFilters } from "./type";
import { fetchProblems, fetchInfo } from "./api";

interface ProblemListState {
  problemList: ProblemList | null;
  loading: boolean;
  error: string | null;
  tags: string[];
  pageSize: number;
  problemCnt: number;
}

const initialState: ProblemListState = {
  problemList: null,
  loading: false,
  error: null,
  tags: [],
  pageSize: 40,
  problemCnt: 0,
};

export const fetchProblemsThunk = createAsyncThunk(
  "problemList/fetchProblems",
  async (filters: ProblemFilters) => {
    const { problems, total_count } = await fetchProblems(filters);
    const problemsList: ProblemList = {
      problems,
      pageCount: Math.ceil(total_count / filters.limit),
      currentPage: filters.page,
      currentLimit: filters.limit,
    };
    return {
      problems: problemsList,
      totalCount: total_count,
    };
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
      state.problemList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProblemsThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProblemsThunk.fulfilled, (state, action) => {
      const { problems, totalCount } = action.payload;

      console.log(problems, totalCount);
      state.problemList = problems;
      state.problemCnt = totalCount;
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
