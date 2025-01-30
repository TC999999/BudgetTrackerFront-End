import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RoutesList from "./RoutesList";
import { useAppDispatch } from "./features/hooks";
import {
  findToken,
  getCurrentUser,
  setUserLoading,
  removeUserError,
} from "./features/auth/authSlice";
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
    if (tokenStatus.hasToken && !tokenStatus.loading) {
      dispatch(getCurrentUser({}));
    } else if (!tokenStatus.hasToken && !tokenStatus.loading) {
      dispatch(setUserLoading(false));
      navigate("/");
    }
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
