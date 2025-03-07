import { createSlice } from "@reduxjs/toolkit";
import {
  registerUser,
  findToken,
  logInUser,
  logOutUser,
} from "../actions/auth";
import { getCurrentUser, addToAssets } from "../actions/users";
import { addNewIncome, updateIncome, removeIncome } from "../actions/incomes";
import { addNewBudget, updateBudget, deleteBudget } from "../actions/budgets";
import { addNewExpense, removeExpense } from "../actions/expenses";
import { INITIAL_STATE } from "../config";

type ActionInterface = {
  type: string;
  payload: any;
};

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    setUserLoading: (state, action: ActionInterface) => {
      state.userInfo.loading = action.payload;
    },
    setSmallLoading: (state, action: ActionInterface) => {
      state.userInfo.smallLoading = action.payload;
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
        state.userInfo.user = INITIAL_STATE.userInfo.user;
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
        state.userInfo.user = action.payload.newUser;
        state.userInfo.recentExpenses = action.payload.recentExpenses;
        state.userInfo.error = null;
        state.hasTokenInfo.hasToken = true;
      })
      .addCase(logInUser.rejected, (state, action: any) => {
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.recentExpenses = INITIAL_STATE.userInfo.recentExpenses;
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
        state.userInfo.user = action.payload.user;
        state.userInfo.recentExpenses = action.payload.recentExpenses;
      })
      .addCase(getCurrentUser.rejected, (state, action: any) => {
        state.userInfo.user = INITIAL_STATE.userInfo.user;
        state.userInfo.recentExpenses = INITIAL_STATE.userInfo.recentExpenses;
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
        state.userInfo.recentExpenses = INITIAL_STATE.userInfo.recentExpenses;
      })
      .addCase(logOutUser.rejected, (state, action: any) => {
        state.hasTokenInfo.loading = false;
        state.userInfo.loading = false;
        state.userInfo.error = action.payload;
      })
      .addCase(addToAssets.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(addToAssets.fulfilled, (state, action: any) => {
        state.userInfo.user!.totalAssets = action.payload.totalAssets;
        state.userInfo.smallLoading = false;
      })
      .addCase(addToAssets.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(addNewIncome.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(addNewIncome.fulfilled, (state, action: any) => {
        state.userInfo.user!.incomes = action.payload.newUserIncomes;
        state.userInfo.smallLoading = false;
      })
      .addCase(addNewIncome.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(updateIncome.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(updateIncome.fulfilled, (state, action: any) => {
        state.userInfo.user!.incomes = action.payload.newUserIncomes;
        state.userInfo.smallLoading = false;
      })
      .addCase(updateIncome.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(removeIncome.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(removeIncome.fulfilled, (state, action: any) => {
        state.userInfo.user!.incomes = action.payload.newUserIncomes;
        state.userInfo.smallLoading = false;
      })
      .addCase(removeIncome.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(addNewBudget.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(addNewBudget.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.user!.totalAssets = action.payload.newAssets;
        state.userInfo.smallLoading = false;
      })
      .addCase(addNewBudget.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(updateBudget.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(updateBudget.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.user!.totalAssets = action.payload.newAssets;
        state.userInfo.smallLoading = false;
      })
      .addCase(updateBudget.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(deleteBudget.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(deleteBudget.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.user.budgets;
        state.userInfo.recentExpenses = action.payload.recentExpenses;
        state.userInfo.user!.totalAssets = action.payload.user.totalAssets;
        state.userInfo.smallLoading = false;
      })
      .addCase(deleteBudget.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(addNewExpense.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(addNewExpense.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.recentExpenses = action.payload.newUserExpenses;
        state.userInfo.smallLoading = false;
      })
      .addCase(addNewExpense.rejected, (state) => {
        state.userInfo.smallLoading = false;
      })
      .addCase(removeExpense.pending, (state) => {
        state.userInfo.smallLoading = true;
      })
      .addCase(removeExpense.fulfilled, (state, action: any) => {
        state.userInfo.user!.budgets = action.payload.newUserBudgets;
        state.userInfo.recentExpenses = action.payload.newUserExpenses;
        state.userInfo.smallLoading = false;
      })
      .addCase(removeExpense.rejected, (state) => {
        state.userInfo.smallLoading = false;
      });
  },
});

export const { setUserLoading, setSmallLoading, removeUserError } =
  authSlice.actions;

export default authSlice.reducer;
