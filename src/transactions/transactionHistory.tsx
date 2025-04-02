import { useEffect, useState } from "react";

import TransactionAPI from "../apis/TransactionAPI";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  Transaction,
  TransactionExpenseList,
} from "../interfaces/transactionInterfaces";
import TransactionList from "./transactionList";
import { setSmallLoading, setTokenError } from "../features/auth/authSlice";

// returns a list of all transactions and expenses the user has made
const TransactionHistory = (): JSX.Element => {
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
      } catch (err: any) {
        dispatch(setTokenError(err.message));
      } finally {
        dispatch(setSmallLoading(false));
      }
    }
    getUserTransactions();
  }, [user]);

  return (
    <div className="transaction-history-page">
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
