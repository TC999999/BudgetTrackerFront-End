import { useRef } from "react";
import { makeDateString, dateInfo } from "../helpers/makeDateString";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

type infoInterface = {
  transaction: number;
  _id: string;
};

// If isFrontPage is true, shows name of budget; if not, shows
// delete button instead
type Props = {
  expense: ExpenseInterface;
  isFrontPage: boolean;
  deleteExpense: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    info: infoInterface
  ) => Promise<void>;
};

// returns expense card to be used for expense list
const ExpenseCard: React.FC<Props> = ({
  expense,
  isFrontPage,
  deleteExpense,
}): JSX.Element => {
  // makes readable date/time string to be displayed on card
  //    month day, year
  //    time
  const dateTime = useRef<dateInfo>(makeDateString(expense.date));
  const notify = () =>
    toast.success(`${expense.title} expense successfully deleted`);

  // uses callback function from expense list to delete expense from both redux state and db
  const deleteTransaction = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    deleteExpense(e, {
      _id: expense._id,
      transaction: expense.transaction,
    });
    notify();
  };

  return (
    <div className="expense-card grid grid-cols-4 px-4 py-4">
      <div className="expense-title p-1 text-sm sm:text-base duration-150 text-center content-center">
        {expense.title}
      </div>
      <div className="expense-transaction p-1 text-sm sm:text-base duration-150 text-center content-center">
        ${expense.transaction}
      </div>
      {isFrontPage && (
        <div className="expense-budget-title p-1 text-sm sm:text-base duration-150 text-center content-center">
          {expense.budget?.title}
        </div>
      )}
      <div className="expense-date p-1 text-sm sm:text-base duration-150 text-center content-center">
        <p>{dateTime.current.date}</p>
        <p>{dateTime.current.time}</p>
      </div>
      {!isFrontPage && (
        <div className="delete-expense-div text-center content-center">
          <button
            onClick={(e) => deleteTransaction(e)}
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
