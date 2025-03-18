import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RoutesList from "./RoutesList";
import { useAppDispatch } from "./features/hooks";
import {
  setUserLoading,
  removeUserError,
  incomeUpdate,
} from "./features/auth/authSlice";
import { findToken } from "./features/actions/auth";
import { getCurrentUser } from "./features/actions/users";
import { useAppSelector } from "./features/hooks";
import LoadingMsg from "./LoadingUserMsg";
import SmallLoadingMsg from "./SmallLoadingMsg";
import { hasTokenInterface } from "./interfaces/authInterfaces";
import { UserContextInterface } from "./interfaces/userInterfaces";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = (message: string) => toast.success(message);
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
  }, [dispatch, tokenStatus.hasToken, tokenStatus.loading]);

  useEffect(() => {
    if (userStatus.user?._id && !userStatus.loading) {
      const es = new EventSource(
        `http://localhost:3001/events/${userStatus.user?._id}`
      );

      es.onopen = () => {
        console.log("Connection Established");
      };

      es.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.newTotalAssets && data.newUserIncomes) {
          dispatch(incomeUpdate(data));
          notify(
            `Recieved Income! Your Total Assets are now $${data.newTotalAssets.totalAssets} `
          );
        }
      };

      es.onerror = (e) => {
        console.log(e);
      };

      return () => es.close();
    }
  }, [userStatus.user?._id, userStatus.loading]);

  useEffect(() => {
    if (location.pathname !== currPath) {
      dispatch(removeUserError());
      setCurrPath(location.pathname);
    }
  }, [location]);

  return (
    <div className="App">
      <LoadingMsg />
      <SmallLoadingMsg />
      <ToastContainer position="bottom-right" />
      {!userStatus.loading && <RoutesList />}
    </div>
  );
}

export default App;
