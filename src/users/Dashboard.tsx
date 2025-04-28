import { useState, useCallback, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { setPageLoading, setLoadError } from "../features/slices/loadSlice";
import { shallowEqual } from "react-redux";
import { Transaction } from "../interfaces/transactionInterfaces";
import { RecentExpense } from "../interfaces/expenseInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import AddTransactionForm from "../transactions/AddTransactionForm";
import Recents from "./Recents";
import UserCard from "./UserCard";
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
  const [expenses, setExpenses] = useState<RecentExpense[]>([]);

  // makes a request to the backend to retrieve all of a single user's 5 most recent budget
  // expenses and 5 most recent miscellaneous transactions
  useEffect((): void => {
    const getRecentTransactions = async (): Promise<void> => {
      dispatch(setPageLoading(true));
      try {
        if (user?._id) {
          const recentTransactions: Transaction[] =
            await TransactionAPI.getRecentUserTransactions(user._id);
          setTransactions(recentTransactions);
          const recentExpenses: RecentExpense[] =
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
  const ShowForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      if (+user!.totalAssets < 999999999999.99) {
        setShowAssetForm(true);
      } else {
        notify();
      }
    },
    [showAssetForm]
  );

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
