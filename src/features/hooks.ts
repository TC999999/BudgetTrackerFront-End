import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

// dispatches redux actions and changes redux state
export const useAppDispatch = () => useDispatch<AppDispatch>();

// selects redux state
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
