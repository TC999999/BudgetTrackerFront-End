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
    <div className="expense-card px-6 py-4">
      <h2 className="expense-title">{props.expense.title}</h2>
      <p className="expense-transaction">${props.expense.transaction}</p>
      {props.isFrontPage && (
        <p className="expense-budget-title">{props.expense.budgetID?.title}</p>
      )}

      <p className="expense-date">{makeDateString(dateString)}</p>
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
            Delete Expense
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
