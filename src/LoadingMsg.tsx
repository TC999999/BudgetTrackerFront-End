import { useAppSelector } from "./features/hooks";
import { UserContextInterface } from "./interfaces/userInterfaces";

const LoadingMsg = () => {
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  return userStatus.loading ? (
    <div className="loading-screen">
      <b>Loading...</b>
    </div>
  ) : null;
};

export default LoadingMsg;
