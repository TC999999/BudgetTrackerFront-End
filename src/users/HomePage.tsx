import LogIn from "../auth/LogIn";
import Dashboard from "./Dashboard";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";

type Props = { mock?: any };

// inital page the user sees upon entering app. If user is logged in,
// will see main dashboard; else they will see the login window
const HomePage: React.FC<Props> = ({ mock }): JSX.Element => {
  const { userExists }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  return (
    <div className="Home-Page">
      {userExists ? <Dashboard mock={mock} /> : <LogIn />}
    </div>
  );
};

export default HomePage;
