import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../features/slices/authSlice.ts";
import loadReducer from "../features/slices/loadSlice.ts";

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
