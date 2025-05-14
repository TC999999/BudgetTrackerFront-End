import { Transaction } from "../interfaces/transactionInterfaces";
import TransactionCard from "./transactionCard";
import TableSkeletonCard from "../skeleton/TableSkeletonCard";
import { loading } from "../interfaces/loadingInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";

type Props = {
  transactions: Transaction[];
};

// returns a list of transactions to be used for both the dashboard and the full
// transaction history page
const TransactionList: React.FC<Props> = ({ transactions }): JSX.Element => {
  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );
  return (
    <div
      id="transactions-list"
      className="bg-white border-2 border-green-500 m-2 rounded-md"
    >
      <header
        id="transaction-list-headers"
        className="grid grid-cols-7 bg-green-200 border-b-2 border-green-500 p-2"
      >
        <b className="table-header">Name</b>
        <b className="table-header">Value</b>
        <b className="table-header">Date</b>
        <b className="table-header">Balance</b>
        <b className="table-header">Income</b>
        <b className="table-header">Misc.</b>
        <b className="table-header">Budget</b>
      </header>

      <div id="transaction-card-list" className="stripedTransactions">
        {!pageLoading && transactions.length > 0 && (
          <div>
            {transactions.map((transaction) => {
              return (
                <TransactionCard
                  key={transaction._id}
                  transaction={transaction}
                />
              );
            })}
          </div>
        )}

        {pageLoading && (
          <div>
            <TableSkeletonCard cards={5} cols="5" />
          </div>
        )}

        {!pageLoading && !transactions.length && (
          <div id="no-transactions" className="text-center text-xl p-2">
            <p className="italic">No Transactions Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
