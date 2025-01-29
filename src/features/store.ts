import authReducer from "./auth/authSlice.ts";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: { user: authReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
