import { useAppSelector } from "./features/hooks";
import { Outlet, Navigate } from "react-router-dom";

const ErrorRouter = (): JSX.Element => {
  const { message, status } = useAppSelector((store) => store.user.loadError);

  return message && status ? <Outlet /> : <Navigate to="/" />;
};

export default ErrorRouter;
