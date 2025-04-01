import { TransactionExpenseList } from "../interfaces/transactionInterfaces";
import TransactionCard from "./transactionCard";

type Props = {
  transactions: TransactionExpenseList;
};

// returns a list of transactions to be used for both the dashboard and the transaction history page
const TransactionList: React.FC<Props> = ({ transactions }): JSX.Element => {
  return (
    <div
      id="transactions-list"
      className="bg-white border-2 border-green-500 m-2 rounded-md"
    >
      <header className="expense-list-headers grid grid-cols-5 bg-green-200 border-b-2 border-green-500 px-4 py-2">
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Name
        </b>
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Value
        </b>
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Date
        </b>
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Income
        </b>
        <b className="text-sm sm:text-base duration-150 text-center content-center">
          Misc.
        </b>
      </header>
      {transactions.length ? (
        <div className="transaction-cards stripedTransactions">
          {transactions.map((transaction) => {
            return (
              <TransactionCard
                key={transaction._id}
                transaction={transaction}
              />
            );
          })}
        </div>
      ) : (
        <div className="no-transactions text-center text-xl p-6">
          <p className="italic">No Transactions Yet</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
