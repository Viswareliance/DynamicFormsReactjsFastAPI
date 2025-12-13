import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    submissions: {},
  },
  reducers: {
    saveProfileData(state, action) {
      const { formType, data } = action.payload;
      state.submissions[formType] = data;
    },

    saveField(state, action) {
      const { formType, field, value } = action.payload;

      if (!state.submissions[formType]) {
        state.submissions[formType] = {};
      }

      state.submissions[formType][field] = value;
    },

    clearProfile(state) {
      state.submissions = {};
    },
  },
});

export const { saveProfileData, saveField, clearProfile } =
  profileSlice.actions;

export default profileSlice.reducer;
