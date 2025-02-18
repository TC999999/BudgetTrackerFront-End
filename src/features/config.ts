import { AuthInitialStateInterface } from "../interfaces/authInterfaces";
import { UserBudgetState } from "../interfaces/budgetInterfaces";
export const API_URL: string = "http://localhost:3001";

export const AUTH_INITIAL_STATE: AuthInitialStateInterface = {
  userInfo: {
    user: null,
    loading: true,
    userExists: false,
    error: "",
  },
  hasTokenInfo: { hasToken: true, loading: true },
};

export const BUDGET_INITIAL_STATE: UserBudgetState = {
  userBudgets: [],
};
