import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userServ } from "../../services/userServ";
import { getLocalStorage } from "../../utils/local";

const initialState = {
  userInfo: getLocalStorage("userInfo"),
  userName: getLocalStorage("userInfo") ? getLocalStorage("userInfo").name : "",
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (values, { rejectWithValue }) => {
    try {
      const result = await userServ.loginServ(values);

      return result.data.content;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.userInfo = action.payload.userInfo;
    },
    updateUserName: (state, action) => {
      state.userName = action.payload;
    },
    saveInfoUser: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.userName = action.payload.name;
      state.userInfo = action.payload.userInfo;
    });
  },
});

export const { userLogin, updateUserName, saveInfoUser } = userSlice.actions;

export default userSlice.reducer;
