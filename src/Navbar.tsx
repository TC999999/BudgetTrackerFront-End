import { useState, useCallback } from "react";
import Logo from "./Logo";
import Logout from "./auth/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./features/hooks";
import { logOutUser } from "./features/actions/auth";

// returns main navbar at the top of the app when user logs in
const Navbar = (): JSX.Element | null => {
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userExists, user } = useAppSelector((store) => store.user.userInfo);

  const hidePrompt = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      setShowPrompt(false);
    },
    []
  );

  // removes the user token from cookies and navigates back to log in page

  const logOutAndNavigate = useCallback(async (): Promise<void> => {
    try {
      navigate("/");
      await dispatch(logOutUser({})).unwrap();
      setShowPrompt(false);
    } catch (err) {
      console.log(err);
    }
  }, []);

  return userExists ? (
    <div>
      <Logout
        showPrompt={showPrompt}
        hidePrompt={hidePrompt}
        logOutAndNavigate={logOutAndNavigate}
      />
      <header id="navbar" className="sticky top-0 p-2 bg-emerald-900 z-20">
        <Logo />
        <nav className="buttons flex justify-around">
          <button
            id="logout-button"
            className="nav-button border-gray-200 bg-gray-300 hover:bg-gray-600 hover:text-white active:bg-gray-100 active:text-gray-900"
            onClick={() => setShowPrompt(true)}
          >
            Log Out
          </button>

          <button
            id="to-transactions-button"
            className="nav-button border-amber-200 bg-amber-300 hover:bg-amber-600 hover:text-white active:bg-amber-100 active:text-gray-900"
            onClick={() => navigate(`/transactions/user/${user?._id}`)}
          >
            Transactions
          </button>

          <button
            id="to-incomes-button"
            className="nav-button border-blue-200 bg-blue-300 hover:bg-blue-600 hover:text-white active:bg-blue-100 active:text-gray-900"
            onClick={() => navigate(`/incomes/user/${user?._id}`)}
          >
            Incomes
          </button>
          <button
            id="to-budgets-button"
            className="nav-button border-green-600 bg-green-700 hover:bg-green-300 active:bg-green-100 active:text-green-700"
            onClick={() => navigate(`/budgets/user/${user?._id}`)}
          >
            Budgets
          </button>
        </nav>
      </header>
    </div>
  ) : null;
};

export default Navbar;
