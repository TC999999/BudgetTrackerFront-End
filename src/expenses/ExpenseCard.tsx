import { useState } from "react";
import { makeDateString } from "../helpers/makeDateString";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";

interface Props {
  expense: ExpenseInterface;
}

const ExpenseCard: React.FC<Props> = (props) => {
  const [dateString] = useState(makeDateString(new Date(props.expense.date)));

  return (
    <div className="expense-card px-6 py-4">
      <h2>{props.expense.title}</h2>
      <p>Transaction Made: ${props.expense.transaction}</p>
      <p>Made At: {dateString}</p>
    </div>
  );
};

export default ExpenseCard;
