import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../src/features/slices/authSlice.ts";
import loadReducer from "../src/features/slices/loadSlice.ts";
import {
  AUTH_INITIAL_STATE_TEST,
  LOADING_INITIAL_STATE_TEST,
} from "./testReduxStore.ts";

// renders a react component with both memory router (for useNavigate) and redux store
export const renderWithRedux = (ui: JSX.Element) => {
  const store = configureStore({
    reducer: combineReducers({
      user: authReducer,
      loading: loadReducer,
    }),
  });

  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

  return { ...renderResult, store };
};

// renders a react component with both memory router (for useNavigate) and redux store
export const renderWithReduxTestStore = (ui: JSX.Element) => {
  const store = configureStore({
    reducer: combineReducers({
      user: authReducer,
      loading: loadReducer,
    }),
    preloadedState: {
      user: AUTH_INITIAL_STATE_TEST,
      loading: LOADING_INITIAL_STATE_TEST,
    },
  });

  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

  return { ...renderResult, store };
};
