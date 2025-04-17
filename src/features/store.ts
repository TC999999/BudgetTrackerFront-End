import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice.ts";

// creates root reducer independently using authreducer from slice
const rootReducer = combineReducers({
  user: authReducer,
});

// creates user and load stores using authSlice context
export function setUpStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setUpStore>;
export type AppDispatch = AppStore["dispatch"];
