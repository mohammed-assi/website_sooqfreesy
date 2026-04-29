// src/redux/slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE } from "../../config/constants";

const userInfo =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE.USER_INFO)) || null;

const initialState = {
  userInfo,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem(
        LOCAL_STORAGE.USER_INFO,
        JSON.stringify(action.payload)
      );
    },
    clearUser: (state) => {
      state.userInfo = null;
      localStorage.removeItem(LOCAL_STORAGE.USER_INFO);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
