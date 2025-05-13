import { useEffect } from "react";
import { useAppDispatch } from ".././features/hooks";
import { AppDispatch } from ".././features/store";
import { incomeUpdate, setUserLoading } from ".././features/slices/authSlice";
import { getCurrentUser } from ".././features/actions/users";
import { useAppSelector } from ".././features/hooks";
import { shallowEqual } from "react-redux";
import { UserContextInterface } from ".././interfaces/userInterfaces";
import { toast, Id } from "react-toastify";
import TokenAPI from ".././apis/TokenAPI";
import { API_URL } from ".././features/config";
import { dollarConverter } from "../helpers/currencyConverter";

// custom hook for entire application: includes retrieving core user data (username and total savings value); also
// listens for server side events for when a single user's income is updated (connection url is unique to user)
const useApp = () => {
  const dispatch: AppDispatch = useAppDispatch();
  const notify = (message: string): Id => toast.success(message);

  const { user, loading }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  // retrieves the current user using refresh token saved as an http only cookie. If there are no tokens, returns an error and
  // returns user to login page
  useEffect((): void => {
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
    if (user?._id && !loading) {
      const es = new EventSource(`${API_URL}/events/${user._id}`);

      es.onopen = () => {
        console.log("SSE Connection Established");
      };

      es.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.newTotalAssets) {
          dispatch(incomeUpdate(data));
          notify(
            `Recieved Income! Your total savings are now ${dollarConverter(
              data.newTotalAssets.totalAssets
            )} `
          );
        }
      };

      es.onerror = (e) => {
        console.log(e);
        es.close();
      };

      return () => es.close();
    }
  }, [dispatch, user?._id, loading]);
};

export default useApp;
