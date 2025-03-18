import LogIn from "../auth/LogIn";
import Dashboard from "./Dashboard";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppSelector } from "../features/hooks";

const HomePage = (): JSX.Element => {
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  return (
    <div className="Home-Page">
      {userStatus.userExists ? <Dashboard /> : <LogIn />}
    </div>
  );
};

export default HomePage;
