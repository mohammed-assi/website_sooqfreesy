import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE } from "../../config/constants";

const refreshToken = localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN) || null;
const accessToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) || null;

const initialState = {
  refreshToken,
  accessToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const res = action.payload;
      const newRefreshToken = res?.refreshToken;
      const newAccessToken = res?.token;
      state.refreshToken = newRefreshToken;
      state.accessToken = newAccessToken;
      localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, newRefreshToken);
      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, newAccessToken);
    },
    logout: (state) => {
      state.refreshToken = null;
      state.accessToken = null;
      localStorage.removeItem(LOCAL_STORAGE.REFRESH_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
