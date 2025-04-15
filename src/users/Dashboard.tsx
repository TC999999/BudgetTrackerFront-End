import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { setSmallLoading, setLoadError } from "../features/auth/authSlice";
import { Transaction } from "../interfaces/transactionInterfaces";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import EditUserForm from "./EditUserForm";
import TransactionList from "../transactions/transactionList";
import ExpenseList from "../expenses/ExpenseList";
import ExpenseAPI from "../apis/ExpenseAPI";
import TransactionAPI from "../apis/TransactionAPI";
import { toast } from "react-toastify";

// returns the main page for users who are logged in: shows their current total assets and
const Dashboard = (): JSX.Element => {
  const { user } = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = () => toast.error("You have reached the maximum asset value");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  // makes a request to the backend to retrieve all of a single user's 5 most recent budget
  // expenses and 5 most recent miscellaneous transactions
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
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
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
    <div id="dashboard-homepage">
      <main>
        <header
          id="dashboard-usercard"
          className="border-2 bg-white border-emerald-900 p-4 m-4 shadow-xl text-center rounded-lg"
        >
          <div id="dashboard-information" className="text-green-700">
            <h1 className="text-2xl sm:text-4xl font-bold">{user?.username}</h1>
            <p className="text-xl">Total Savings Available:</p>
            <p className="text-3xl sm:text-5xl font-bold">
              ${user?.totalAssets}
            </p>
          </div>
          <div
            id="show-make-transaction-button"
            className="flex justify-center m-4"
          >
            <button
              className="border rounded-full bg-green-700 p-1 sm:p-2 text-sm sm:text-base hover:bg-green-300 hover:underline active:bg-gray-100 active:text-green-400"
              onClick={(e) => ShowForm(e)}
            >
              Document a Transaction
            </button>
          </div>
        </header>
        {showAssetForm && <EditUserForm hideForm={HideForm} />}
        <section id="recent-transactions-list">
          <header className="text-center m-2">
            <h2
              id="recent-transactions-list-title"
              className="text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 font-bold duration-150"
            >
              Recent Miscellaneous Transactions
            </h2>
            <small>
              Below are your 5 most recent transactions, which includes both
              that you have documented yourself and from your incomes: past and
              present.
            </small>
          </header>
          <TransactionList transactions={transactions} />
        </section>

        <section className="recent-expenses-list">
          <header className="text-center m-2">
            <h2
              id="recent-expenses-list-title"
              className="text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 font-bold duration-150"
            >
              Recent Budget Expenses
            </h2>
            <small>
              Below are your 5 most recent budget expenses. These only include
              expenses made using funds from all budgets you have presently.
            </small>
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
