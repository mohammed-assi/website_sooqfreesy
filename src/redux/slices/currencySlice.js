import { createSlice } from "@reduxjs/toolkit";
import { LOCAL_STORAGE } from "../../config/constants";

const initialState = {
  value: localStorage.getItem(LOCAL_STORAGE.CURRENCY) || "SYP",
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.value = action.payload;
      localStorage.setItem(LOCAL_STORAGE.CURRENCY, action.payload);
    },
    toggleCurrency: (state) => {
      const newCurrency = state.value === "USD" ? "SYP" : "USD";
      state.value = newCurrency;
      localStorage.setItem(LOCAL_STORAGE.CURRENCY, newCurrency);
    },
    clearCurrency: (state) => {
      state.value = "SYP";
      localStorage.removeItem(LOCAL_STORAGE.CURRENCY);
    },
  },
});

export const { setCurrency, toggleCurrency, clearCurrency } = currencySlice.actions;
export default currencySlice.reducer;
