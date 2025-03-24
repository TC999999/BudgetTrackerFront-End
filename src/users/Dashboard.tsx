import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { logOutUser } from "../features/actions/auth";
import EditUserForm from "./EditUserForm";
import ExpenseList from "../expenses/ExpenseList";
import { TfiMoney } from "react-icons/tfi";
import { toast } from "react-toastify";

// returns the main page for users who are logged in: shows their current total assets and
const Dashboard = (): JSX.Element => {
  const { user, recentExpenses } = useAppSelector(
    (store) => store.user.userInfo
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = () => toast.error("You have reached the maximum asset value");
  const [showAssetForm, setShowAssetForm] = useState(false);

  // updates state for showing the update asset form to true, unless the user's current total asset value equals the
  // maximum allowed value
  const ShowForm = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ): void => {
    e.preventDefault();
    if (+user!.totalAssets < 999999999999.99) {
      setShowAssetForm(true);
    } else {
      notify();
    }
  };

  // updates state for showing the update asset form to false
  const HideForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowAssetForm(false);
    },
    [showAssetForm]
  );

  // removes the user token from cookies and navigates back to log in page
  const logOutAnNavigate = async (): Promise<void> => {
    try {
      await dispatch(logOutUser({})).unwrap();
      navigate("/");
    } catch (err) {
      console.log("HERE IS ERROR", err);
    }
  };

  return (
    <div className="dashboard-homepage">
      <header className="sticky top-0">
        <nav className="buttons flex justify-around p-2 bg-emerald-900 ">
          <button
            className="logout-button border border-gray-200 bg-gray-300 p-1 sm:p-2 text-sm sm:text-lg rounded-full hover:bg-gray-600 hover:text-white active:bg-gray-100 active:text-gray-900"
            onClick={logOutAnNavigate}
          >
            Log Out
          </button>
          <button
            className="to-incomes-button border border-blue-200 bg-blue-300 p-1 sm:p-2 text-sm sm:text-lg rounded-full hover:bg-blue-600 hover:text-white active:bg-blue-100 active:text-gray-900"
            onClick={() => navigate("/incomes")}
          >
            Check out your incomes
          </button>
          <button
            onClick={() => navigate("/budgets")}
            className="to-budgets-button border border-green-600 bg-green-700 p-1 sm:p-2 text-sm sm:text-lg rounded-full flex justify-center hover:bg-green-300 active:bg-gray-100 active:text-green-700"
          >
            <TfiMoney className="my-1" />
            <span>Check out your budgets </span>
            <TfiMoney className="my-1" />
          </button>
        </nav>
      </header>
      <main>
        <header className="dashboard-usercard border-2 bg-white border-emerald-900 p-4 m-4 shadow-xl text-center">
          <div className="dashboard-information text-green-700">
            <h1 className="text-2xl sm:text-4xl font-bold">{user?.username}</h1>
            <p className="text-xl">Assets Available:</p>
            <p className="text-3xl sm:text-5xl font-bold">
              ${user?.totalAssets}
            </p>
          </div>
          <div className="add-asset-button flex justify-center m-4">
            <button
              className="border rounded-full bg-green-700 p-1 sm:p-2 text-sm sm:text-base hover:bg-green-300 hover:underline active:bg-gray-100 active:text-green-400"
              onClick={(e) => ShowForm(e)}
            >
              Update Your Available Assets
            </button>
          </div>
        </header>
        {showAssetForm && <EditUserForm hideForm={HideForm} />}
        <section className="recent-expenses-list">
          <header>
            <h2 className="recent-expenses-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
              Your 10 Most Recent Expenses
            </h2>
          </header>
          <ExpenseList
            expensesList={recentExpenses}
            isFrontPage={true}
            budgetID={null}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
