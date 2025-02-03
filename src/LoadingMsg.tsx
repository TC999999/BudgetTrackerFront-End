// import { useAppSelector } from "./features/hooks";
// import { UserContextInterface } from "./interfaces/userInterfaces";

const LoadingMsg = () => {
  // const userStatus: UserContextInterface = useAppSelector(
  //   (store) => store.user.userInfo
  // );

  // return userStatus.loading ? (
  //   <div className="loading-msg">
  //     <b>Loading...</b>
  //   </div>
  // ) : null;

  return (
    <div className="loading-msg">
      <b>Loading...</b>
    </div>
  );
};

export default LoadingMsg;
