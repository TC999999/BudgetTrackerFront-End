import { useRef } from "react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { makeDateString, dateInfo } from "../helpers/makeDateString";
import {
  ExpenseInterface,
  RecentExpense,
} from "../interfaces/expenseInterfaces";
import { infoInterface } from "../interfaces/miscTypes";
import { FaTrashAlt } from "react-icons/fa";
import { shallowEqual } from "react-redux";
import { dollarConverter } from "../helpers/currencyConverter";

// If isFrontPage is true, shows name of budget; if not, shows
// delete button instead
type Props = {
  expense: ExpenseInterface | RecentExpense;
  showSecondPrompt: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    expense: infoInterface
  ) => void;
};

// returns a card to be used for a single expense to be used for ExpenseList.tsx
const ExpenseCard: React.FC<Props> = ({
  expense,
  showSecondPrompt,
}): JSX.Element => {
  // makes readable date/time string to be displayed on card
  //    month day, year
  //    time
  const dateTime = useRef<dateInfo>(makeDateString(expense.date));

  const userID: string = useAppSelector(
    (store) => store.user.userInfo.user?._id!,
    shallowEqual
  );

  return (
    <div className="expense-card grid grid-cols-4 p-4">
      <div className="expense-title p-1 text-sm sm:text-base duration-150 text-center content-center">
        {expense.title}
      </div>
      <div className="expense-transaction p-1 text-red-700 text-sm sm:text-base duration-150 text-center content-center">
        -{dollarConverter(expense.transaction)}
      </div>

      <div className="expense-date p-1 text-sm sm:text-base duration-150 text-center content-center">
        <p>{dateTime.current.date}</p>
        <p>{dateTime.current.time}</p>
      </div>

      {"budget" in expense && "budgetID" in expense ? (
        <div className="expense-budget-title p-1 text-sm sm:text-base duration-150 text-center content-center">
          <Link
            to={`/budgets/${expense.budgetID}/user/${userID}`}
            className="text-green-600 underline hover:text-green-400"
          >
            {expense.budget}
          </Link>
        </div>
      ) : (
        <div className="delete-expense-div text-center content-center">
          <button
            onClick={(e) =>
              showSecondPrompt(e, {
                _id: expense._id,
                transaction: expense.transaction,
              })
            }
            className="delete-expense-button border-2 border-red-500 p-2 sm:px-5 rounded-md bg-red-200 hover:bg-red-600 hover:text-white active:bg-red-100 active:text-black text-sm sm:text-base duration-150"
          >
            <FaTrashAlt />
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
