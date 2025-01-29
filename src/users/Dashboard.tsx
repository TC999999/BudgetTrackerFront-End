import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { logOutUser } from "../features/auth/authSlice";
import EditUserForm from "./EditUserForm";

const Dashboard = () => {
  const { user } = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showAssetForm, setShowAssetForm] = useState(false);

  const HideForm = () => {
    setShowAssetForm(false);
  };

  const logOutAnNavigate = (): void => {
    dispatch(logOutUser({}));
    navigate("/");
  };
  return (
    <div>
      <button onClick={logOutAnNavigate}>Log Out</button>
      <h1 className="mb-4">User: {user?.username}</h1>
      <p>Funds Available: ${user?.totalAssets}</p>
      {!showAssetForm && (
        <button onClick={() => setShowAssetForm(true)}>
          Add to Your Assets.
        </button>
      )}
      {showAssetForm && <EditUserForm hideForm={HideForm} />}
      <Link to="/budgets">Check out your budgets</Link>
    </div>
  );
};

export default Dashboard;
