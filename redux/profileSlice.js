import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profileImage: 'https://i.imgur.com/UOVSGbo.png',
    nameUser: 'User',
    darkMode: false,
  },
  reducers: {
    updateProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
    updateNameUser: (state, action) => {
      state.nameUser = action.payload;
    },
    toggleDarkMode: (state) => {
        state.darkMode = !state.darkMode;
      },
  },
});

export const { updateProfileImage, updateNameUser, toggleDarkMode } = profileSlice.actions;
export default profileSlice.reducer;
