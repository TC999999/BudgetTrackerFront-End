import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { UserContextInterface } from "../interfaces/userInterfaces";
import AddTransactionForm from "../transactions/AddTransactionForm";
import Recents from "./Recents";
import UserCard from "./UserCard";
import useDashboard from "./hooks/useDashboard";

// returns the main page for users who are logged in: shows their current total assets and
const Dashboard = (): JSX.Element => {
  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );
  const {
    showAssetForm,
    transactions,
    expenses,
    ShowForm,
    HideForm,
    updateTransactions,
  } = useDashboard(user!);

  return (
    <div id="dashboard-homepage">
      <main className="relative animate-page-entrance">
        <UserCard user={user!} showForm={ShowForm} />
        {showAssetForm && (
          <AddTransactionForm
            hideForm={HideForm}
            updateTransactions={updateTransactions}
          />
        )}
        <Recents expenses={expenses} transactions={transactions} />
      </main>
    </div>
  );
};

export default Dashboard;
