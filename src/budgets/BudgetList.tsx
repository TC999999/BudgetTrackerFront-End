import BudgetCard from "./BudgetCard";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

interface Props {
  allBudgets: BudgetListInterface[] | null;
}

const BudgetList: React.FC<Props> = (props) => {
  return (
    <div className="budget-list stripedBudgets">
      <h1 className="text-center text-2xl text-emerald-500">
        {" "}
        All Current Budgets
      </h1>
      {props.allBudgets?.map((budget) => (
        <BudgetCard key={budget._id} budget={budget} />
      ))}
    </div>
  );
};

export default BudgetList;
