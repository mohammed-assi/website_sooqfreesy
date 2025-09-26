// src/redux/slices/locationSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE } from "../../config/constants";

const initialState = {
  coords: JSON.parse(localStorage.getItem(LOCAL_STORAGE.COORDS)) || {
    lat: null,
    lng: null,
    country: null,
  },
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationCoords: (state, action) => {
      state.coords = action.payload;
      localStorage.setItem(
        LOCAL_STORAGE.COORDS,
        JSON.stringify(action.payload)
      );
    },
    clearLocationCoords: (state) => {
      state.coords = { lat: null, lng: null, country: null };
      localStorage.removeItem(LOCAL_STORAGE.COORDS);
    },
  },
});

export const { setLocationCoords, clearLocationCoords } = locationSlice.actions;
export default locationSlice.reducer;
