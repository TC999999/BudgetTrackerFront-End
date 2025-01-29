import LogIn from "../auth/LogIn";
import Dashboard from "./Dashboard";
import { useAppSelector } from "../features/hooks";

const HomePage = () => {
  const userStatus = useAppSelector((store) => store.user.userInfo);

  return (
    <div className="Home-Page">
      {userStatus.userExists ? <Dashboard /> : <LogIn />}
    </div>
  );
};

export default HomePage;
