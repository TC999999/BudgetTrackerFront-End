import { AuthInitialStateInterface } from "../interfaces/authInterfaces";

// backend API string
export const API_URL: string = "http://localhost:3001";

// typing for redux store
export const INITIAL_STATE: AuthInitialStateInterface = {
  userInfo: {
    user: null,
    loading: true,
    userExists: false,
    error: "",
  },
  loadingInfo: {
    pageLoading: true,
    formLoading: false,
  },
  loadError: {
    message: "",
    status: null,
  },
};
