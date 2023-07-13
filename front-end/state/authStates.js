import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  userId: null,
  userName: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUserId(state) {
      state.userId = null;
    },
    setuserName(state, action) {
      state.userName = action.payload;
    },
    clearuserName(state) {
      state.userName = null;
    },
  },
});

export const {
  setUserId,
  clearUserId,
  setuserName,
  clearuserName,
} = authSlice.actions;

export default authSlice.reducer;
