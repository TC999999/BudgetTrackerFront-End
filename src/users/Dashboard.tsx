import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { logOutUser } from "../features/actions/auth";
import EditUserForm from "./EditUserForm";
import ExpenseList from "../expenses/ExpenseList";
import { TfiMoney } from "react-icons/tfi";

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((store) => store.user.userInfo);
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
      <div className="buttons flex justify-around p-2 bg-emerald-900 sticky top-0">
        <div className="logout-button">
          <button
            className="border border-blue-200 bg-blue-300 p-2 rounded-full hover:bg-blue-600 hover:text-white active:bg-blue-100 active:text-gray-900"
            onClick={logOutAnNavigate}
          >
            Log Out
          </button>
        </div>
        <div className="to-budgets-button">
          <button
            onClick={() => navigate("/budgets")}
            className="border-2 border-green-600 bg-green-700 rounded-full p-2 flex justify-center hover:bg-green-300 active:bg-gray-100 active:text-green-700"
          >
            <TfiMoney className="text-lg my-1" />
            <span>Check out your budgets </span>
            <TfiMoney className="text-lg my-1" />
          </button>
        </div>
      </div>
      <div className="dashboard-usercard border-2 bg-white border-emerald-900 px-4 py-4 mx-4 my-4 shadow-xl">
        <div className="dashboard-username text-emerald-600">
          <h1 className="text-2xl text-center">{user?.username}</h1>
        </div>
        <div className="dashboard-totalAssets text-emerald-600 text-center">
          <p className="text-xl">Assets Available:</p>
          <p className="text-3xl">${user?.totalAssets}</p>
        </div>

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
        <h2 className="recent-expenses-list-title text-center text-3xl underline text-emerald-600 mb-2">
          Your 10 Most Recent Expenses
        </h2>
        <ExpenseList
          expensesList={user!.recentExpenses}
          isFrontPage={true}
          budgetID={null}
        />
      </div>
    </div>
  );
};

export default Dashboard;
