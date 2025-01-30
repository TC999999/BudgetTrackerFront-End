import { useMemo } from "react";
import { makeDateString } from "../helpers/makeDateString";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";

interface Props {
  expense: ExpenseInterface;
}

const ExpenseCard: React.FC<Props> = (props) => {
  const dateString: string = useMemo<string>(
    () => makeDateString(props.expense.date),
    [props.expense]
  );
  return (
    <div className="expense-card px-6 py-4">
      <h2 className="expense-title">{props.expense.title}</h2>
      <p className="expense-transaction">
        Transaction Made: ${props.expense.transaction}
      </p>
      <p className="expense-date">Made At: {makeDateString(dateString)}</p>
    </div>
  );
};

export default ExpenseCard;
