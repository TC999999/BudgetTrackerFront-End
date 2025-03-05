import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { logOutUser } from "../features/actions/auth";
import EditUserForm from "./EditUserForm";
import ExpenseList from "../expenses/ExpenseList";
import { TfiMoney } from "react-icons/tfi";

const Dashboard: React.FC = () => {
  const { user, recentExpenses } = useAppSelector(
    (store) => store.user.userInfo
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showAssetForm, setShowAssetForm] = useState(false);

  const HideForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowAssetForm(false);
    },
    [showAssetForm]
  );

  const logOutAnNavigate = (): void => {
    dispatch(logOutUser({}));
    navigate("/");
  };

  return (
    <div className="dashboard-homepage">
      <nav className="buttons flex justify-around p-2 bg-emerald-900 sticky top-0">
        <button
          className="logout-button border border-gray-200 bg-gray-300 p-2 rounded-full hover:bg-gray-600 hover:text-white active:bg-gray-100 active:text-gray-900"
          onClick={logOutAnNavigate}
        >
          Log Out
        </button>
        <button
          className="to-incomes-button border border-blue-200 bg-blue-300 p-2 rounded-full hover:bg-blue-600 hover:text-white active:bg-blue-100 active:text-gray-900"
          onClick={() => navigate("/incomes")}
        >
          Check out your incomes
        </button>
        <button
          onClick={() => navigate("/budgets")}
          className="to-budgets-button border-2 border-green-600 bg-green-700 rounded-full p-2 flex justify-center hover:bg-green-300 active:bg-gray-100 active:text-green-700"
        >
          <TfiMoney className="text-lg my-1" />
          <span>Check out your budgets </span>
          <TfiMoney className="text-lg my-1" />
        </button>
      </nav>
      <div className="dashboard-usercard border-2 bg-white border-emerald-900 px-4 py-4 mx-4 my-4 shadow-xl text-center">
        <header className="dashboard-information text-green-700">
          <h1 className="text-2xl sm:text-4xl font-bold">{user?.username}</h1>
          <p className="text-xl">Assets Available:</p>
          <p className="text-3xl sm:text-5xl font-bold">${user?.totalAssets}</p>
        </header>
        <div className="add-asset-button flex justify-center m-4">
          <button
            className="border rounded-full bg-green-700 px-2 py-2 hover:bg-green-300 hover:underline active:bg-gray-100 active:text-green-400"
            onClick={() => setShowAssetForm(true)}
          >
            Update Your Available Assets
          </button>
        </div>
      </div>
      {showAssetForm && <EditUserForm hideForm={HideForm} />}

      <div className="recent-expenses-list">
        <h2 className="recent-expenses-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
          Your 10 Most Recent Expenses
        </h2>
        <ExpenseList
          expensesList={recentExpenses}
          isFrontPage={true}
          budgetID={null}
        />
      </div>
    </div>
  );
};

export default Dashboard;
