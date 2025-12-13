import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../redux/profileSlice.js";

const store = configureStore({
  reducer: { profile: profileReducer },
});

export default store;
