import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isActive: false,
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startedLoading: (state, action) => {
      state.isActive = true;
    },
    endedLoading: (state, action) => {
      state.isActive = false;
    },
  },
});

export const { startedLoading, endedLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
