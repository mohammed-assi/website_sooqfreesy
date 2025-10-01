import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE } from "../../config/constants";

const fcmToken = localStorage.getItem(LOCAL_STORAGE.FCM_TOKEN) || "";

const initialState = {
  fcmToken,
};

const tokenSlice = createSlice({
  name: "fcmToken",
  initialState,
  reducers: {
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
      localStorage.setItem(LOCAL_STORAGE.FCM_TOKEN, action.payload);
    },
    clearFcmToken: (state) => {
      state.fcmToken = "";
      localStorage.removeItem(LOCAL_STORAGE.FCM_TOKEN);
    },
  },
});

export const { setFcmToken, clearFcmToken } = tokenSlice.actions;
export default tokenSlice.reducer;
