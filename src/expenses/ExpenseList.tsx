import ExpenseCard from "./ExpenseCard";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";

interface Props {
  expensesList: ExpenseInterface[];
}
const ExpenseList: React.FC<Props> = (props) => {
  return (
    <div className="expense-list">
      {props.expensesList.map((e) => {
        return <ExpenseCard key={e._id} expense={e} />;
      })}
    </div>
  );
};

export default ExpenseList;
