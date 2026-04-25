import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { filmServManagement } from "../../services/filmServManagement";

export const getAllMovieThunk = createAsyncThunk(
  "movie/getAllMovieThunk",
  async (data, thunkAPI) => {
    const result = await filmServManagement.getAllMovie();

    return result.data;
  },
);

const initialState = {
  listMovie: [],
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    endedLoading: (state, action) => {
      state.listMovie = ["hello"];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllMovieThunk.fulfilled, (state, action) => {
      state.listMovie = action.payload;
    });
  },
});

export default movieSlice.reducer;
