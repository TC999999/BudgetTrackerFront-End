import { useRef } from "react";
import { makeDateString, dateInfo } from "../helpers/makeDateString";
import {
  transactionType,
  transactionValAndType,
} from "../helpers/transactionType";
import { Transaction } from "../interfaces/transactionInterfaces";
import { ImCheckmark } from "react-icons/im";
import { dollarConverter } from "../helpers/currencyConverter";
import { returnBudgetColor } from "../helpers/returnBudgetColor";

type Props = {
  transaction: Transaction;
};

// returns a card that shows data for a single transaction on the transaction list
const TransactionCard: React.FC<Props> = ({ transaction }): JSX.Element => {
  // makes readable date/time string to be displayed on card
  //    month day, year
  //    time
  const dateTime = useRef<dateInfo>(makeDateString(transaction.date));
  const transactionValue = useRef<transactionValAndType>(
    transactionType(transaction)
  );

  return (
    <div className="transaction-card grid grid-cols-7 p-2">
      <div className="transaction-title p-2 text-xs sm:text-base duration-150 text-center content-center">
        {transaction.title}
      </div>

      <div
        className={`expense-transaction p-2 text-xs sm:text-base duration-150 text-center content-center
      ${transactionValue.current.add ? "text-blue-700" : "text-red-700"}`}
      >
        {transactionValue.current.value}
      </div>

      <div className="transaction-date p-2 text-xs sm:text-base duration-150 text-center content-center">
        <p>{dateTime.current.date}</p>
        <p>{dateTime.current.time}</p>
      </div>

      <div className="transaction-new-balance p-2 text-xs sm:text-base duration-150 text-center content-center">
        <p>{dollarConverter(transaction.newBalance)}</p>
      </div>

      <div className="transaction-incomme p-2 text-xs sm:text-base duration-150 text-center content-center">
        {"fromIncome" in transaction && transaction.fromIncome ? (
          <div className="flex justify-center content-center text-green-700">
            <ImCheckmark />
          </div>
        ) : (
          <p>-</p>
        )}
      </div>

      <div className="transaction-misc p-2 text-xs sm:text-base duration-150 text-center content-center">
        {"fromIncome" in transaction &&
        !transaction.fromIncome &&
        transaction.budgetOperation === "-" ? (
          <div className="flex justify-center content-center text-green-700">
            <ImCheckmark />
          </div>
        ) : (
          <p>-</p>
        )}
      </div>

      <div
        className={`transaction-budget-op p-2 text-xs sm:text-base duration-150 text-center content-center`}
      >
        <div
          className={`flex justify-center content-center ${returnBudgetColor(
            transaction.budgetOperation
          )}`}
        >
          {transaction.budgetOperation}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
