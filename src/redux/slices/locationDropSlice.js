import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  open: false,
};

const locationDropSlice = createSlice({
  name: "locationDrop",
  initialState,
  reducers: {
    setLocationDrop: (state, action) => {
      state.open = action.payload;
    },
    toggleLocationDrop: (state) => {
      state.open = !state.open;
    },
  },
});

export const { setLocationDrop, toggleLocationDrop } = locationDropSlice.actions;
export default locationDropSlice.reducer;
