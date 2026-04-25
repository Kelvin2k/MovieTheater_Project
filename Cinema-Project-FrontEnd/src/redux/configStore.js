import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./Slice/userSlice";
import movieSlice from "./Slice/movieSlice";
import loadingSlice from "./Slice/loadingSlice";

export const store = configureStore({
  reducer: {
    age: () => {
      return 13;
    },
    userSlice,
    movieSlice,
    loadingSlice,
  },
});



