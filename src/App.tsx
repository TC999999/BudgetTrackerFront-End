import { useEffect } from "react";
import RoutesList from "./RoutesList";
import { useAppDispatch } from "./features/hooks";
import { incomeUpdate, setUserLoading } from "./features/auth/authSlice";
import { getCurrentUser } from "./features/actions/users";
import { useAppSelector } from "./features/hooks";
import LoadingMsg from "./LoadingUserMsg";
import SmallLoadingMsg from "./SmallLoadingMsg";
import TokenErrorMsg from "./TokenErrorMsg";
import Navbar from "./Navbar";
import { UserContextInterface } from "./interfaces/userInterfaces";
import { ToastContainer, toast } from "react-toastify";
import TokenAPI from "./apis/TokenAPI";

//renders whole application
function App(): JSX.Element {
  const dispatch = useAppDispatch();
  const notify = (message: string) => toast.success(message);

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  // retrieves the current user using refresh token saved as an http only cookie. If there are no tokens, returns an error and
  // returns user to login page
  useEffect(() => {
    const getUserInfo = async () => {
      if (await TokenAPI.getRefreshToken()) {
        await dispatch(getCurrentUser({}));
        dispatch(setUserLoading(false));
      } else {
        dispatch(setUserLoading(false));
      }
    };
    getUserInfo();
  }, [dispatch]);

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
        if (data.newTotalAssets) {
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

  // returns loading messages, toast notifications, and routes list
  return (
    <div className="App">
      <LoadingMsg />
      <SmallLoadingMsg />
      <TokenErrorMsg />
      <ToastContainer position="bottom-right" />
      <Navbar />
      {!userStatus.loading && <RoutesList />}
    </div>
  );
}

export default App;
