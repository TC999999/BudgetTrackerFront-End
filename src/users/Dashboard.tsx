import { useState, useCallback, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { setPageLoading, setLoadError } from "../features/slices/loadSlice";
import { shallowEqual } from "react-redux";
import { Transaction } from "../interfaces/transactionInterfaces";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import EditUserForm from "./EditUserForm";
import TransactionList from "../transactions/TransactionList";
import ExpenseList from "../expenses/ExpenseList";
import ExpenseAPI from "../apis/ExpenseAPI";
import TransactionAPI from "../apis/TransactionAPI";
import { addNewTransaction } from "../helpers/addNewTransaction";
import { toast, Id } from "react-toastify";

// returns the main page for users who are logged in: shows their current total assets and
const Dashboard = (): JSX.Element => {
  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (): Id =>
    toast.error("You have reached the maximum asset value");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  // makes a request to the backend to retrieve all of a single user's 5 most recent budget
  // expenses and 5 most recent miscellaneous transactions
  useEffect((): void => {
    const getRecentTransactions = async () => {
      dispatch(setPageLoading(true));
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
        dispatch(setPageLoading(false));
      }
    };
    getRecentTransactions();
  }, [user?._id]);

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

  // adds new transaction to recent transaction list when user documents a new transaction
  const updateTransactions = useCallback(
    (newTransaction: Transaction): void => {
      setTransactions((prevTransactions) =>
        addNewTransaction(prevTransactions, [newTransaction])
      );
    },
    [transactions]
  );

  return (
    <div id="dashboard-homepage">
      <main>
        <header
          id="dashboard-usercard"
          className="border-2 bg-white border-emerald-900 p-2 m-4 shadow-xl text-center rounded-lg"
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
        {showAssetForm && (
          <EditUserForm
            hideForm={HideForm}
            updateTransactions={updateTransactions}
          />
        )}

        <div id="recent-data">
          <section
            id="recent-transactions-list"
            className="transition duration-150"
          >
            <header className="text-center m-2">
              <h2 id="recent-transactions-list-title" className="list-header">
                Recent Miscellaneous Transactions
              </h2>
              <small>
                Below are your most recent transactions (≤5), which includes
                both that you have documented yourself and from your incomes:
                past and present.
              </small>
            </header>
            <TransactionList transactions={transactions} />
          </section>

          <section
            id="recent-expenses-list"
            className="transition duration-150"
          >
            <header className="text-center m-2">
              <h2 id="recent-expenses-list-title" className="list-header">
                Recent Budget Expenses
              </h2>
              <small>
                Below are your most recent budget expenses (≤5). These only
                include expenses made using funds from all budgets you have
                presently.
              </small>
            </header>
            <ExpenseList expensesList={expenses} isFrontPage={true} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
