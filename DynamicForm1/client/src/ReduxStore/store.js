import { configureStore } from "@reduxjs/toolkit";
import answersReducer from "./reduxSlice.js";

export const store = configureStore({
  reducer: {
    answers: answersReducer,
  },
});
