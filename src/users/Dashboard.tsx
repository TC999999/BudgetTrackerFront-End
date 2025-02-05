import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { logOutUser } from "../features/actions/auth";
import EditUserForm from "./EditUserForm";
import ExpenseList from "../expenses/ExpenseList";

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showAssetForm, setShowAssetForm] = useState(false);

  const HideForm = useCallback((): void => {
    setShowAssetForm(false);
  }, [showAssetForm]);

  const logOutAnNavigate = (): void => {
    dispatch(logOutUser({}));
    navigate("/");
  };
  return (
    <div>
      <div className="dashboard-usercard">
        <button onClick={logOutAnNavigate}>Log Out</button>
        <h1 className="dashboard-username mb-4">User: {user?.username}</h1>
        <p>Funds Available: ${user?.totalAssets}</p>
        {!showAssetForm && (
          <button onClick={() => setShowAssetForm(true)}>
            Add to Your Assets.
          </button>
        )}
      </div>
      {showAssetForm && <EditUserForm hideForm={HideForm} />}
      <div className="link-to-budgets">
        <Link to="/budgets">Check out your budgets</Link>
      </div>

      <div className="recent-expenses-list">
        <h2 className="recent-expenses-list-title text-center text-2xl text-emerald-600">
          Recent Expenses
        </h2>
        <ExpenseList
          expensesList={user.expenses}
          isFrontPage={true}
          budgetID={null}
        />
      </div>
    </div>
  );
};

export default Dashboard;
