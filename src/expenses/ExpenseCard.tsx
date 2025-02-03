import { useMemo } from "react";
import { makeDateString } from "../helpers/makeDateString";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";

interface Props {
  expense: ExpenseInterface;
  isFrontPage: boolean;
  deleteExpense: any;
}

const ExpenseCard: React.FC<Props> = (props) => {
  const dateString: string = useMemo<string>(
    () => makeDateString(props.expense.date),
    [props.expense]
  );

  return (
    <div className="expense-card grid grid-cols-4 px-4 py-4">
      <div className="expense-title">
        <p>{props.expense.title}</p>
      </div>
      <div className="expense-transaction">
        <p>${props.expense.transaction}</p>
      </div>
      {props.isFrontPage && (
        <div className="expense-budget-title">
          <p>{props.expense.budgetID?.title}</p>
        </div>
      )}
      <div className="expense-date">
        <p>{makeDateString(dateString)}</p>
      </div>
      {!props.isFrontPage && (
        <div className="delete-expense-div">
          <button
            onClick={(e) =>
              props.deleteExpense(e, {
                _id: props.expense._id,
                transaction: props.expense.transaction,
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
