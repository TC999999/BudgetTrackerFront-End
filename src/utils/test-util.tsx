import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../features/auth/authSlice.ts";

export const renderWithRedux = (ui: JSX.Element) => {
  const store = configureStore({
    reducer: { user: authReducer },
  });

  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );

  return { ...renderResult, store };
};
