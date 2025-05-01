import { useParams } from "react-router-dom";
import TransactionList from "./TransactionList";
import ListHeader from "../ListHeader";
import useTransactionHistory from "./hooks/useTransactionHistory";

// returns a list of all miscellaneous transactions the user has made
const TransactionHistory = (): JSX.Element => {
  const { id } = useParams();
  const { transactions } = useTransactionHistory(id);

  // if there are no transactions in the list state, returns an on page loading message
  // instead
  return (
    <div className="transaction-history-page">
      <section>
        <ListHeader type="Transactions" />
        <TransactionList transactions={transactions} />
      </section>
    </div>
  );
};

export default TransactionHistory;
