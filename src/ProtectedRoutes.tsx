import { useAppSelector } from "./features/hooks";
import { Outlet, Navigate } from "react-router-dom";

// provides protection for routes that users are not allowed to visit before logging in
const ProtectedRoutes = () => {
  const userExists: boolean = useAppSelector(
    (store) => store.user.userInfo.userExists
  );
  return userExists ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
