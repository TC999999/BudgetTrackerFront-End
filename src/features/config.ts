import { AuthInitialStateInterface } from "../interfaces/authInterfaces";

export const API_URL: string = "http://localhost:3001";

export const INITIAL_STATE: AuthInitialStateInterface = {
  userInfo: {
    user: null,
    loading: true,
    userExists: false,
    error: "",
  },

  hasTokenInfo: { hasToken: true, loading: true },
};
