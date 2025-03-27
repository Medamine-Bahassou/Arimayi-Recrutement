import { configureStore } from "@reduxjs/toolkit";
import candidatesReducer from "./slices/candidatesSlice.js";

export const store = configureStore({
  reducer: {
    candidates: candidatesReducer,
  },
});
