import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: {},
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
  },
});

export const { setNotifications, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
