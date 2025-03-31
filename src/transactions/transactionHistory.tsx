import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TransactionAPI from "../apis/TransactionAPI";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  Transaction,
  TransactionExpenseList,
} from "../interfaces/transactionInterfaces";
import TransactionList from "./transactionList";
import { setSmallLoading } from "../features/auth/authSlice";

// returns a list of all transactions and expenses the user has made
const TransactionHistory = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((store) => store.user.userInfo);
  const [transactions, setTransactions] = useState<TransactionExpenseList>([]);

  // since this is potentially a large amount of data, we will be calling
  useEffect(() => {
    async function getUserTransactions() {
      try {
        dispatch(setSmallLoading(true));
        let transactions: Transaction[] =
          await TransactionAPI.getUserTransactions(user!._id);
        setTransactions(transactions);
        dispatch(setSmallLoading(false));
      } catch (err) {
        console.log(err);
        dispatch(setSmallLoading(false));
      }
    }
    getUserTransactions();
  }, [user]);

  return (
    <div className="transaction-history-page">
      <header className="sticky top-0">
        <nav className="buttons p-2 bg-emerald-900 ">
          <button
            className="home-button border border-blue-200 bg-blue-300 p-1 sm:p-2 text-sm sm:text-lg rounded-full hover:bg-blue-600 hover:text-white active:bg-blue-100 active:text-gray-900 transition duration-150"
            onClick={() => navigate("/")}
          >
            Go Back
          </button>
        </nav>
      </header>
      <section>
        <header>
          <h2 className="recent-expenses-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
            Full Transaction History
          </h2>
        </header>
        <TransactionList transactions={transactions} />
      </section>
    </div>
  );
};

export default TransactionHistory;
