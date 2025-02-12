import { useRef } from "react";
import { makeDateString, dateInfo } from "../helpers/makeDateString";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";

type infoInterface = {
  transaction: number;
  _id: string;
};

type Props = {
  expense: ExpenseInterface;
  isFrontPage: boolean;
  deleteExpense: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    info: infoInterface
  ) => Promise<void>;
};

const ExpenseCard: React.FC<Props> = ({
  expense,
  isFrontPage,
  deleteExpense,
}) => {
  const dateTime = useRef<dateInfo>(makeDateString(expense.date));

  return (
    <div className="expense-card grid grid-cols-4 px-4 py-4">
      <div className="expense-title">
        <p>{expense.title}</p>
      </div>
      <div className="expense-transaction">
        <p>${expense.transaction}</p>
      </div>
      {isFrontPage && (
        <div className="expense-budget-title">
          <p>{expense.budgetID?.title}</p>
        </div>
      )}
      <div className="expense-date">
        <p className="text-sm">{dateTime.current.date}</p>
        <p className="text-sm">{dateTime.current.time}</p>
      </div>
      {!isFrontPage && (
        <div className="delete-expense-div">
          <button
            onClick={(e) =>
              deleteExpense(e, {
                _id: expense._id,
                transaction: expense.transaction,
              })
            }
            className="delete-expense-button border-2 border-red-500 p-1 rounded-md bg-red-200 hover:bg-red-600 hover:text-white duration-300 active:bg-red-100 active:text-black"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
