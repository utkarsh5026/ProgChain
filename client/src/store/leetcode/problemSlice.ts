import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProblemInfo, generateSolution } from "./api";
import { QuestionDetail, SolutionRequest } from "./type";

interface ProblemInfoState {
  problemInfo: QuestionDetail | null;
  loading: boolean;
  solutionLoading: boolean;
  chatLoading: boolean;
  error: string | null;
}

export const fetchProblemInfoThunk = createAsyncThunk(
  "problem/fetchProblemInfo",
  async (problemName: string) => {
    const response = await fetchProblemInfo(problemName);
    return response;
  }
);

export const generateSolutionThunk = createAsyncThunk(
  "problem/generateSolution",
  async (request: SolutionRequest) => {
    const response = await generateSolution(request);
    return {
      ...response,
      language: request.progLang,
    };
  }
);

const initialState: ProblemInfoState = {
  problemInfo: null,
  loading: false,
  solutionLoading: false,
  chatLoading: false,
  error: null,
};

export const problemSlice = createSlice({
  name: "problem",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProblemInfoThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProblemInfoThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.problemInfo = {
        model: "gpt-4o-mini",
        problem: action.payload,
        chat: [],
        solution: {},
      };
    });
    builder.addCase(fetchProblemInfoThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "Failed to fetch problem info";
    });
    builder.addCase(generateSolutionThunk.pending, (state) => {
      state.solutionLoading = true;
    });
    builder.addCase(generateSolutionThunk.fulfilled, (state, action) => {
      state.solutionLoading = false;
      if (state.problemInfo) {
        state.problemInfo = {
          ...state.problemInfo,
          solution: {
            ...state.problemInfo.solution,
            [action.payload.language]: action.payload,
          },
        };
      }
    });
    builder.addCase(generateSolutionThunk.rejected, (state, action) => {
      state.solutionLoading = false;
      state.error = action.error.message ?? "Failed to generate solution";
    });
  },
});

export default problemSlice.reducer;
