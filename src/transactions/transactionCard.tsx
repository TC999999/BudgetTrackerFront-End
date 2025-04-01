import { useRef } from "react";
import { makeDateString, dateInfo } from "../helpers/makeDateString";
import {
  transactionType,
  transactionValAndType,
} from "../helpers/transactionType";
import { Transaction } from "../interfaces/transactionInterfaces";
import { TransactionExpense } from "../interfaces/expenseInterfaces";
import { ImCheckmark } from "react-icons/im";

type Props = {
  transaction: Transaction | TransactionExpense;
};

// returns a card with all necessary information for transactions
const TransactionCard: React.FC<Props> = ({ transaction }): JSX.Element => {
  // makes readable date/time string to be displayed on card
  //    month day, year
  //    time
  const dateTime = useRef<dateInfo>(makeDateString(transaction.date));
  const transactionValue = useRef<transactionValAndType>(
    transactionType(transaction)
  );

  return (
    <div className="transaction-card grid grid-cols-5 px-4 py-4">
      <div className="transaction-title p-1 text-sm sm:text-base duration-150 text-center content-center">
        {transaction.title}
      </div>

      <div
        className={`expense-transaction p-1 text-sm sm:text-base duration-150 text-center content-center
      ${transactionValue.current.add ? "text-blue-700" : "text-red-700"}`}
      >
        {transactionValue.current.value}
      </div>

      <div className="transaction-date p-1 text-sm sm:text-base duration-150 text-center content-center">
        <p>{dateTime.current.date}</p>
        <p>{dateTime.current.time}</p>
      </div>

      <div className="transaction-incomme p-1 text-sm sm:text-base duration-150 text-center content-center">
        {"fromIncome" in transaction && transaction.fromIncome ? (
          <div className="flex justify-center content-center">
            <ImCheckmark />
          </div>
        ) : (
          <p>-</p>
        )}
      </div>

      <div className="transaction-misc p-1 text-sm sm:text-base duration-150 text-center content-center">
        {"fromIncome" in transaction && !transaction.fromIncome ? (
          <div className="flex justify-center content-center">
            <ImCheckmark />
          </div>
        ) : (
          <p>-</p>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;
