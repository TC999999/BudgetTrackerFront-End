import { UserInfoInterface } from "../interfaces/userInterfaces";

type Props = {
  user: UserInfoInterface;
  showForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
const UserCard: React.FC<Props> = ({ user, showForm }) => {
  return (
    <header
      id="dashboard-usercard"
      className="border-2 bg-white border-emerald-900 p-2 m-4 shadow-xl text-center rounded-lg"
    >
      <div id="dashboard-information" className="text-green-700">
        <h1 className="text-2xl sm:text-4xl font-bold">{user?.username}</h1>
        <p className="text-xl">Total Savings Available:</p>
        <p className="text-3xl sm:text-5xl font-bold">${user?.totalAssets}</p>
      </div>
      <div
        id="show-make-transaction-button"
        className="flex justify-center m-4"
      >
        <button
          className="border rounded-full bg-green-700 p-1 sm:p-2 text-sm sm:text-base hover:bg-green-300 hover:underline active:bg-gray-100 active:text-green-400"
          onClick={(e) => showForm(e)}
        >
          Document a Transaction
        </button>
      </div>
    </header>
  );
};

export default UserCard;
