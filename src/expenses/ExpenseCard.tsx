import { useMemo } from "react";
import { makeDateString } from "../helpers/makeDateString";
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
  const dateString: string = useMemo<string>(
    () => makeDateString(expense.date),
    [expense]
  );

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
        <p>{makeDateString(dateString)}</p>
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
            className="delete-expense-button"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
