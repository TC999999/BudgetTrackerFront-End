import authReducer from "./auth/authSlice.ts";

import { configureStore } from "@reduxjs/toolkit";

// creates user and token stores using authSlice context
const store = configureStore({
  reducer: { user: authReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
