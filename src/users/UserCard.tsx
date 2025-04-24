import { UserInfoInterface } from "../interfaces/userInterfaces";
import { useNavigate, NavigateFunction } from "react-router-dom";

type Props = {
  user: UserInfoInterface;
  showForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
const UserCard: React.FC<Props> = ({ user, showForm }) => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <header
      id="dashboard-usercard"
      className="border-2 bg-white border-emerald-900 p-2 m-4 shadow-xl text-center rounded-lg"
    >
      <div id="dashboard-information" className="text-green-700">
        <h1 className="text-2xl sm:text-4xl font-bold">{user.username}</h1>
        <p className="text-xl">Total Savings Available:</p>
        <p className="text-3xl sm:text-5xl font-bold">${user.totalAssets}</p>
      </div>
      <div id="buttons" className="flex flex-col items-center m-4">
        <button
          id="show-make-transaction-button"
          className="border w-72 rounded-full bg-green-700 p-2 text-sm sm:text-base hover:bg-green-300 hover:underline active:bg-gray-100 active:text-green-400 mb-2"
          onClick={(e) => showForm(e)}
        >
          Document a Transaction
        </button>

        <button
          id="edit-button"
          className="border w-72 rounded-full bg-orange-700 p-2 text-sm sm:text-base hover:bg-orange-300 hover:underline active:bg-gray-100 active:text-orange-400"
          onClick={() => navigate(`/user/${user._id}/edit`)}
        >
          Edit Profile
        </button>
      </div>
    </header>
  );
};

export default UserCard;
