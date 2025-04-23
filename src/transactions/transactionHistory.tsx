import { useEffect, useState } from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import TransactionAPI from "../apis/TransactionAPI";
import { useAppDispatch } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { Transaction } from "../interfaces/transactionInterfaces";
import TransactionList from "./TransactionList";
import { setLoadError, setPageLoading } from "../features/slices/loadSlice";

// returns a list of all miscellaneous transactions the user has made
const TransactionHistory = (): JSX.Element => {
  const { id } = useParams();
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // makes a request to retrieve all of a single user's transactions from db on initial
  // render
  useEffect((): void => {
    async function getUserTransactions() {
      try {
        dispatch(setPageLoading(true));
        if (id) {
          let transactions: Transaction[] =
            await TransactionAPI.getUserTransactions(id);
          setTransactions(transactions);
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setPageLoading(false));
      }
    }
    getUserTransactions();
  }, [id]);

  // if there are no transactions in the list state, returns an on page loading message
  // instead
  return (
    <div className="transaction-history-page">
      <section>
        <header className="text-center m-2">
          <h2
            id="transaction-list-title"
            className="text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 font-bold duration-150"
          >
            Full Transaction History
          </h2>
          <small>
            Here are all transactions made from funds directly from your
            savings. They cannot be edited or deleted. They may include incomes
            that you do not recieve anymore.
          </small>
        </header>
        <TransactionList transactions={transactions} />
      </section>
    </div>
  );
};

export default TransactionHistory;
