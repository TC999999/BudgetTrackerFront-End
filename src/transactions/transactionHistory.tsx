import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TransactionAPI from "../apis/TransactionAPI";
import { useAppDispatch } from "../features/hooks";
import { Transaction } from "../interfaces/transactionInterfaces";
import TransactionList from "./transactionList";
import OnPageLoading from "../OnPageLoading";
import { setSmallLoading, setLoadError } from "../features/auth/authSlice";

// returns a list of all miscellaneous transactions the user has made
const TransactionHistory = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // makes a request to retrieve all of a single user's transactions from db on initial
  // render
  useEffect(() => {
    async function getUserTransactions() {
      try {
        dispatch(setSmallLoading(true));
        if (id) {
          let transactions: Transaction[] =
            await TransactionAPI.getUserTransactions(id);
          setTransactions(transactions);
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setSmallLoading(false));
      }
    }
    getUserTransactions();
  }, [id]);

  // if there are no transactions in the list state, returns an on page loading message
  // instead
  return transactions.length ? (
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
            These transactions cannot be edited or deleted. These transactions
            include incomes that you may not recieve anymore.
          </small>
        </header>
        <TransactionList transactions={transactions} />
      </section>
    </div>
  ) : (
    <OnPageLoading loadingMsg="Transaction History" />
  );
};

export default TransactionHistory;
