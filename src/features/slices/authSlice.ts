import { createSlice } from "@reduxjs/toolkit";
import { registerUser, logInUser, logOutUser } from "../actions/auth";
import { getCurrentUser, addToAssets } from "../actions/users";
import { AUTH_INITIAL_STATE } from "../config";
import { ActionInterface } from "../../interfaces/miscTypes";

// redux slice for global user state
const authSlice = createSlice({
  name: "auth",
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    // changes loading state for retrieving or creating all user information
    setUserLoading: (state, action: ActionInterface) => {
      state.userInfo.loading = action.payload;
    },
    // removes state for errors involving loading user information
    removeUserError: (state) => {
      state.userInfo.error = null;
    },
    // changes user total asset state
    setTotalAssets: (state, action: ActionInterface) => {
      state.userInfo.user!.totalAssets = action.payload;
    },
    // changes income state when an SSE is heard
    incomeUpdate: (state, action: ActionInterface) => {
      let { newTotalAssets } = action.payload;
      state.userInfo.user!.totalAssets = newTotalAssets.totalAssets;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload.newUser;
        state.userInfo.error = null;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        state.userInfo.user = AUTH_INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = action.payload;
      })
      .addCase(logInUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(logInUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload.user;
        state.userInfo.error = null;
      })
      .addCase(logInUser.rejected, (state, action: any) => {
        state.userInfo.user = AUTH_INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = action.payload;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload.user;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.userInfo.user = AUTH_INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
      })
      .addCase(logOutUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.user = AUTH_INITIAL_STATE.userInfo.user;
      })
      .addCase(logOutUser.rejected, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.error = action.payload;
      })
      .addCase(addToAssets.fulfilled, (state, action: any) => {
        let { user } = action.payload;
        state.userInfo.user!.totalAssets = user.totalAssets;
      });
  },
});

export const { setUserLoading, removeUserError, setTotalAssets, incomeUpdate } =
  authSlice.actions;

export default authSlice.reducer;
