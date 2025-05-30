import { AuthInitialStateInterface } from "../src/interfaces/authInterfaces";
import { LoadingContext } from "../src/interfaces/loadingInterfaces";

export const AUTH_INITIAL_STATE_TEST: AuthInitialStateInterface = {
  userInfo: {
    user: { _id: "12345", username: "testuser", totalAssets: 1000 },
    loading: false,
    userExists: true,
    error: "",
  },
};

export const LOADING_INITIAL_STATE_TEST: LoadingContext = {
  loadingInfo: {
    pageLoading: false,
    formLoading: false,
  },
  loadError: {
    message: "",
    status: null,
  },
};

export const LOADING_INITIAL_STATE_TEST_PAGE_LOAD: LoadingContext = {
  loadingInfo: {
    pageLoading: true,
    formLoading: false,
  },
  loadError: {
    message: "",
    status: null,
  },
};

export const LOADING_INITIAL_STATE_TEST_ERROR: LoadingContext = {
  loadingInfo: {
    pageLoading: false,
    formLoading: false,
  },
  loadError: {
    message: "Bad Request",
    status: 400,
  },
};
