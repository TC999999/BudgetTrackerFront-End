import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { UserContextInterface } from "../interfaces/userInterfaces";
import AddTransactionForm from "../transactions/AddTransactionForm";
import Recents from "./Recents";
import UserCard from "./UserCard";
import useDashboard from "./hooks/useDashboard";
import Page from "../motionWrappers/Page";

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
    <Page>
      <main>
        <UserCard user={user!} showForm={ShowForm} />

        <AddTransactionForm
          hideForm={HideForm}
          updateTransactions={updateTransactions}
          show={showAssetForm}
        />

        <Recents expenses={expenses} transactions={transactions} />
      </main>
    </Page>
  );
};

export default Dashboard;
