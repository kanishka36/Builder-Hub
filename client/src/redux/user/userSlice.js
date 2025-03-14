import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    signOutSuccess: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    authenticateSuccess: (state) => {
      state.isAuthenticated = true;
    },
    authenticateFailure: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  authenticateSuccess,
  authenticateFailure,
  updateUserSuccess,
} = userSlice.actions;

export default userSlice.reducer;
