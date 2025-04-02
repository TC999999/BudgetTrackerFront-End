import { useState, useCallback, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { Transaction } from "../interfaces/transactionInterfaces";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import EditUserForm from "./EditUserForm";
import TransactionList from "../transactions/transactionList";
import TransactionAPI from "../apis/TransactionAPI";
import { setSmallLoading, setTokenError } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import ExpenseAPI from "../apis/ExpenseAPI";
import ExpenseList from "../expenses/ExpenseList";

// returns the main page for users who are logged in: shows their current total assets and
const Dashboard = (): JSX.Element => {
  const { user } = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();
  const notify = () => toast.error("You have reached the maximum asset value");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  useEffect(() => {
    const getRecentTransactions = async () => {
      dispatch(setSmallLoading(true));
      try {
        if (user?._id) {
          const recentTransactions: Transaction[] =
            await TransactionAPI.getRecentUserTransactions(user._id);
          setTransactions(recentTransactions);
          const recentExpenses: ExpenseInterface[] =
            await ExpenseAPI.getRecentUserExpenses(user._id);
          setExpenses(recentExpenses);
        }
      } catch (err: any) {
        dispatch(setTokenError(err.message));
      } finally {
        dispatch(setSmallLoading(false));
      }
    };
    getRecentTransactions();
  }, [user?._id, user?.totalAssets]);

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

  return (
    <div className="dashboard-homepage">
      <main>
        <header className="dashboard-usercard border-2 bg-white border-emerald-900 p-4 m-4 shadow-xl text-center">
          <div className="dashboard-information text-green-700">
            <h1 className="text-2xl sm:text-4xl font-bold">{user?.username}</h1>
            <p className="text-xl">Total Savings Available:</p>
            <p className="text-3xl sm:text-5xl font-bold">
              ${user?.totalAssets}
            </p>
          </div>
          <div className="add-asset-button flex justify-center m-4">
            <button
              className="border rounded-full bg-green-700 p-1 sm:p-2 text-sm sm:text-base hover:bg-green-300 hover:underline active:bg-gray-100 active:text-green-400"
              onClick={(e) => ShowForm(e)}
            >
              Document a Miscellaneous Transaction
            </button>
          </div>
        </header>
        {showAssetForm && <EditUserForm hideForm={HideForm} />}
        <section className="recent-transactions-list">
          <header>
            <h2 className="recent-transactions-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
              Your 5 Most Recent Miscellaneous Transactions
            </h2>
          </header>
          <TransactionList transactions={transactions} />
        </section>

        <section className="recent-expenses-list">
          <header>
            <h2 className="recent-expenses-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
              Your 5 Most Recent Budget Expenses
            </h2>
          </header>
          <ExpenseList
            expensesList={expenses}
            isFrontPage={true}
            budgetID={null}
          />
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
