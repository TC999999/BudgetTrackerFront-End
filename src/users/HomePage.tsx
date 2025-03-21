import LogIn from "../auth/LogIn";
import Dashboard from "./Dashboard";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppSelector } from "../features/hooks";

// inital page the user sees upon entering app. If user is logged in,
// will see main dashboard; else they will see the login window
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
