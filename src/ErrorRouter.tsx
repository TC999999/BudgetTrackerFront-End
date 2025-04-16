import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { error } from "./interfaces/miscTypes";

// prevents users with that do not have errors from accessing error page
const ErrorRouter = (): JSX.Element => {
  const { message, status }: error = useAppSelector(
    (store) => store.user.loadError,
    shallowEqual
  );

  return message && status ? <Outlet /> : <Navigate to="/" />;
};

export default ErrorRouter;
