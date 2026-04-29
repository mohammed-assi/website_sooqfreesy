import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: {},
  count: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = {};
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    clearCount: (state) => {
      state.count = 0;
    },
  },
});

export const { setNotifications, clearNotifications, setCount, clearCount } =
  notificationSlice.actions;
export default notificationSlice.reducer;
