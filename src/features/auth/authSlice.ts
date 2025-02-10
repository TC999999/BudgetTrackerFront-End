import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  findToken,
  logInUser,
  logOutUser,
} from "../actions/auth";
import { SignUpErrorInterface } from "../../interfaces/authInterfaces";
import { getCurrentUser, addToAssets } from "../actions/users";
import { addNewBudget, updateBudget, deleteBudget } from "../actions/budgets";
import { addNewExpense, removeExpense } from "../actions/expenses";
import { INITIAL_STATE } from "../config";

interface ActionInterface {
  type: string;
  payload: any;
}

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    setUserLoading: (state, action: ActionInterface) => {
      state.userInfo.loading = action.payload;
    },
    removeUserError: (state) => {
      state.userInfo.error = null;
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
        state.userInfo.user = action.payload;
        state.userInfo.error = null;
        state.hasTokenInfo.hasToken = true;
      })
      .addCase(registerUser.rejected, (state, action: any) => {
        // console.log(action.payload);
        let payload: SignUpErrorInterface = action.payload;
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = payload;
      })
      .addCase(logInUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(logInUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload;
        state.userInfo.error = null;
        state.hasTokenInfo.hasToken = true;
      })
      .addCase(logInUser.rejected, (state, action: any) => {
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = action.payload;
      })
      .addCase(findToken.pending, (state) => {
        state.hasTokenInfo.loading = true;
      })
      .addCase(findToken.fulfilled, (state, action: any) => {
        state.hasTokenInfo.loading = false;
        state.hasTokenInfo.hasToken = action.payload.token ? true : false;
      })
      .addCase(findToken.rejected, (state) => {
        state.hasTokenInfo.loading = false;
        state.hasTokenInfo.hasToken = false;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.userInfo.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: any) => {
        state.userInfo.loading = false;
        state.userInfo.userExists = true;
        state.userInfo.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action: any) => {
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.loading = false;
        state.userInfo.userExists = false;
        state.userInfo.error = action.payload;
      })
      .addCase(logOutUser.pending, (state) => {
        state.hasTokenInfo.loading = true;
        state.userInfo.loading = true;
      })
      .addCase(logOutUser.fulfilled, (state) => {
        state.hasTokenInfo.loading = false;
        state.userInfo.loading = false;
        state.hasTokenInfo.hasToken = false;
        state.userInfo.userExists = false;
        state.userInfo.user = INITIAL_STATE.userInfo.user;
      })
      .addCase(logOutUser.rejected, (state, action: any) => {
        state.hasTokenInfo.loading = false;
        state.userInfo.loading = false;
        state.userInfo.error = action.payload;
      })
      .addCase(addToAssets.fulfilled, (state, action: any) => {
        state.userInfo.user!.totalAssets = action.payload.totalAssets;
      })
      .addCase(addNewBudget.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.user!.totalAssets = action.payload.newAssets;
      })

      .addCase(updateBudget.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.user!.totalAssets = action.payload.newAssets;
      })
      .addCase(deleteBudget.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.user.budgets;
        state.userInfo.user!.expenses = action.payload.user.expenses;
        state.userInfo.user!.totalAssets = action.payload.user.totalAssets;
      })
      .addCase(addNewExpense.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.user!.expenses = action.payload.newUserExpenses;
      })
      .addCase(removeExpense.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.user!.expenses = action.payload.newUserExpenses;
      });
  },
});

export const { setUserLoading, removeUserError } = authSlice.actions;
// export const { setUserLoading } = authSlice.actions;

export default authSlice.reducer;
