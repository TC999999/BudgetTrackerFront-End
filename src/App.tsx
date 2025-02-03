import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RoutesList from "./RoutesList";
import { useAppDispatch } from "./features/hooks";
import { setUserLoading, removeUserError } from "./features/auth/authSlice";
import { findToken } from "./features/actions/auth";
import { getCurrentUser } from "./features/actions/users";
import { useAppSelector } from "./features/hooks";
import LoadingMsg from "./LoadingMsg";
import { hasTokenInterface } from "./interfaces/authInterfaces";
import { UserContextInterface } from "./interfaces/userInterfaces";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currPath, setCurrPath] = useState<string>("/");

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  const tokenStatus: hasTokenInterface = useAppSelector(
    (store) => store.user.hasTokenInfo
  );

  useEffect(() => {
    const getTokenInfo = async () => {
      await dispatch(findToken({}));
    };
    getTokenInfo();
  }, [dispatch]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (tokenStatus.hasToken && !tokenStatus.loading) {
        await dispatch(getCurrentUser({}));
      } else if (!tokenStatus.hasToken && !tokenStatus.loading) {
        dispatch(setUserLoading(false));
        navigate("/");
      }
    };
    getUserInfo();
  }, [dispatch, tokenStatus]);

  useEffect(() => {
    if (location.pathname !== currPath) {
      dispatch(removeUserError());
      setCurrPath(location.pathname);
    }
  }, [location]);

  if (userStatus.loading) {
    return <LoadingMsg />;
  }

  return (
    <div className="App">
      <RoutesList />
    </div>
  );
}

export default App;
