// skillsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const skillsSlice = createSlice({
  name: 'skills',
  initialState: [],
  reducers: {
    addSkill: (state, action) => {
      state.push(action.payload);
    },
    setSkills: (state, action) => {
      return action.payload;
    },
  },
});

export const { addSkill, setSkills } = skillsSlice.actions;
export default skillsSlice.reducer;
