// src/ReduxStore/reduxSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // structure: { Company: [{ qturnId, Question_description, answer }], Department: [...], ... }
  answers: {},
};

const answersSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    addAnswer: (state, action) => {
      const { category, qturnId, Question_description, answer } =
        action.payload;
      if (!category) return;

      if (!state.answers[category]) state.answers[category] = [];

      const idx = state.answers[category].findIndex(
        (a) => a.qturnId === qturnId
      );
      const payload = { qturnId, Question_description, answer };

      if (idx !== -1) {
        state.answers[category][idx] = payload;
      } else {
        state.answers[category].push(payload);
      }
    },

    removeAnswer: (state, action) => {
      const { category, qturnId } = action.payload;
      if (!category || !state.answers[category]) return;
      state.answers[category] = state.answers[category].filter(
        (a) => a.qturnId !== qturnId
      );
    },

    resetCategoryAnswers: (state, action) => {
      const { category } = action.payload;
      if (!category) return;
      state.answers[category] = [];
    },

    resetAllAnswers: (state) => {
      state.answers = {};
    },
  },
});

export const {
  addAnswer,
  removeAnswer,
  resetCategoryAnswers,
  resetAllAnswers,
} = answersSlice.actions;

export default answersSlice.reducer;
