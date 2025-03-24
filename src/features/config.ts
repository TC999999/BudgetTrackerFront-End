import { AuthInitialStateInterface } from "../interfaces/authInterfaces";

// backend API string
export const API_URL: string = "http://localhost:3001";

// typing for redux store
export const INITIAL_STATE: AuthInitialStateInterface = {
  userInfo: {
    user: null,
    recentExpenses: [],
    loading: true,
    smallLoading: false,
    userExists: false,
    error: "",
  },
  hasTokenInfo: {
    hasRefreshToken: false,
    loading: true,
  },
};
