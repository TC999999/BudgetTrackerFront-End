import Logo from "./Logo";
import Logout from "./auth/Logout";
import { useAppSelector } from "./features/hooks";
import { shallowEqual } from "react-redux";
import { UserContextInterface } from "./interfaces/userInterfaces";
import useNavbar from "./hooks/useNavbar";

// returns main navbar at the top of the app when user logs in
const Navbar = (): JSX.Element | null => {
  const { userExists, user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const { showPrompt, goToURL, changePromptState, logOutAndNavigate } =
    useNavbar();

  return userExists ? (
    <div className="sticky top-0 p-2 bg-emerald-900 z-20">
      <Logout
        showPrompt={showPrompt}
        hidePrompt={changePromptState}
        logOutAndNavigate={logOutAndNavigate}
      />
      <header id="navbar">
        <Logo />
        <nav className="buttons flex justify-around">
          <button
            id="logout-button"
            className="nav-button border-gray-200 bg-gray-300 hover:bg-gray-600 hover:text-white active:bg-gray-100 active:text-gray-900"
            onClick={(e) => changePromptState(e, true)}
          >
            Log Out
          </button>

          <button
            id="to-transactions-button"
            className="nav-button border-amber-200 bg-amber-300 hover:bg-amber-600 hover:text-white active:bg-amber-100 active:text-gray-900"
            onClick={(e) => goToURL(e, `/transactions/user/${user?._id}`)}
          >
            Transactions
          </button>

          <button
            id="to-incomes-button"
            className="nav-button border-blue-200 bg-blue-300 hover:bg-blue-600 hover:text-white active:bg-blue-100 active:text-gray-900"
            onClick={(e) => goToURL(e, `/incomes/user/${user?._id}`)}
          >
            Incomes
          </button>
          <button
            id="to-budgets-button"
            className="nav-button border-green-600 bg-green-700 hover:bg-green-300 active:bg-green-100 active:text-green-700"
            onClick={(e) => goToURL(e, `/budgets/user/${user?._id}`)}
          >
            Budgets
          </button>
        </nav>
      </header>
    </div>
  ) : null;
};

export default Navbar;
