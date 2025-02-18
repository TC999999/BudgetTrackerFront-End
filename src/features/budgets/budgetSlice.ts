import { createSlice } from "@reduxjs/toolkit";
import { addNewBudget, updateBudget, deleteBudget } from "../actions/budgets";
import { BUDGET_INITIAL_STATE } from "../config";

const budgetSlice = createSlice({
  name: "budget",
  initialState: BUDGET_INITIAL_STATE,
  reducers: {},
});

export default budgetSlice.reducer;
