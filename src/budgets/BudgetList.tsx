import BudgetCard from "./BudgetCard";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

interface Props {
  allBudgets: BudgetListInterface[] | null;
}

const BudgetList: React.FC<Props> = (props) => {
  return (
    <div className="budget-list stripedBudgets">
      <h1 className="text-center text-3xl text-emerald-500 underline font-bold">
        {" "}
        All Current Budgets
      </h1>
      <div className="flex flex-wrap justify-center">
        {props.allBudgets?.map((budget) => (
          <BudgetCard key={budget._id} budget={budget} />
        ))}
        {!props.allBudgets?.length && (
          <div className="no-budgets">
            {" "}
            <p className="text-xl m-4 italic">You currently have no budgets</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetList;
