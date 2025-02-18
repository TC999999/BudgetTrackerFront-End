import authReducer from "./auth/authSlice.ts";
import budgetReducer from "./budgets/budgetSlice.ts";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: { user: authReducer, budgets: budgetReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
