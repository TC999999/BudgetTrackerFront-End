import { AuthInitialStateInterface } from "../interfaces/authInterfaces";
import { LoadingContext } from "../interfaces/loadingInterfaces";

// backend API string
export const API_URL: string = "http://localhost:3001";

// typing for redux store
export const AUTH_INITIAL_STATE: AuthInitialStateInterface = {
  userInfo: {
    user: null,
    loading: true,
    userExists: false,
    error: "",
  },
};

export const LOADING_INITIAL_STATE: LoadingContext = {
  loadingInfo: {
    pageLoading: false,
    formLoading: false,
  },
  loadError: {
    message: "",
    status: null,
  },
};
