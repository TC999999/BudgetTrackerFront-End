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

//renders whole application
function App(): JSX.Element {
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

  // checks to see if there's a refresh JWT stored in cookies, sets access JWT in cookies
  useEffect(() => {
    const getTokenInfo = async () => {
      await dispatch(findToken({})).unwrap();
    };
    getTokenInfo();
  }, [dispatch]);

  // if a refresh JWT is found in cookies, retrieves the information tied to that user from the db and stores in redux
  useEffect(() => {
    const getUserInfo = async () => {
      if (tokenStatus.hasRefreshToken && !tokenStatus.loading) {
        await dispatch(getCurrentUser({}));
      } else if (!tokenStatus.hasRefreshToken && !tokenStatus.loading) {
        dispatch(setUserLoading(false));
        navigate("/");
      }
    };
    getUserInfo();
  }, [dispatch, tokenStatus.hasRefreshToken, tokenStatus.loading]);

  // if user information is found in redux, opens an event source connection to the server to listen
  // for live updates
  useEffect(() => {
    if (userStatus.user?._id && !userStatus.loading) {
      const es = new EventSource(
        `http://localhost:3001/events/${userStatus.user._id}`
      );

      es.onopen = () => {
        console.log("SSE Connection Established");
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
        es.close();
      };

      return () => es.close();
    }
  }, [dispatch, userStatus.user?._id, userStatus.loading]);

  // removes user error if the path name in the url changes
  useEffect(() => {
    if (location.pathname !== currPath) {
      dispatch(removeUserError());
      setCurrPath(location.pathname);
    }
  }, [location]);

  // returns loading messages, toast notifications, and routes list
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
