import { useParams } from "react-router-dom";
import TransactionList from "./transactionList";
import ListHeader from "../ListHeader";
import useTransactionHistory from "./hooks/useTransactionHistory";
import Page from "../motionWrappers/Page";

// returns a list of all miscellaneous transactions the user has made
const TransactionHistory = (): JSX.Element => {
  const { id } = useParams();
  const { transactions } = useTransactionHistory(id);

  // if there are no transactions in the list state, returns an on page loading message
  // instead
  return (
    <Page>
      <div id="transaction-history-page">
        <section>
          <ListHeader type="Savings" />
          <TransactionList transactions={transactions} />
        </section>
      </div>
    </Page>
  );
};

export default TransactionHistory;
