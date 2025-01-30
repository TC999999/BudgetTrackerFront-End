import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { logOutUser } from "../features/auth/authSlice";
import EditUserForm from "./EditUserForm";
import ExpenseList from "../expenses/ExpenseList";

const Dashboard = () => {
  const { user } = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showAssetForm, setShowAssetForm] = useState(false);

  const HideForm = useCallback(() => {
    setShowAssetForm(false);
  }, [showAssetForm]);

  const logOutAnNavigate = (): void => {
    dispatch(logOutUser({}));
    navigate("/");
  };
  return (
    <div>
      <button onClick={logOutAnNavigate}>Log Out</button>
      <h1 className="dashboard-username mb-4">User: {user?.username}</h1>
      <p>Funds Available: ${user?.totalAssets}</p>
      {!showAssetForm && (
        <button onClick={() => setShowAssetForm(true)}>
          Add to Your Assets.
        </button>
      )}
      {showAssetForm && <EditUserForm hideForm={HideForm} />}
      <div className="link-to-budgets">
        <Link to="/budgets">Check out your budgets</Link>
      </div>

      <div className="recent-expenses-list">
        <h2 className="recent-expenses-list-title">Recent Expenses</h2>
        <ExpenseList expensesList={user.expenses} />
      </div>
    </div>
  );
};

export default Dashboard;
