import BudgetCard from "./BudgetCard";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

interface Props {
  allBudgets: BudgetListInterface[] | null;
}

const BudgetList: React.FC<Props> = (props) => {
  return (
    <div className="budget-list">
      <h1> All Current Budgets</h1>
      {props.allBudgets?.map((budget) => (
        <BudgetCard key={budget._id} budget={budget} />
      ))}
    </div>
  );
};

export default BudgetList;
