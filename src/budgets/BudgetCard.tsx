import { Link } from "react-router-dom";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

interface Props {
  budget: BudgetListInterface;
}

const BudgetCard: React.FC<Props> = (props) => {
  return (
    <div className="budget-card px-6 py-4">
      <h3 className="budget-title">
        <Link to={`/budgets/${props.budget._id}`}>{props.budget.title}</Link>
      </h3>

      <p className="budget-money-allocation">
        Total Money Allocated: ${props.budget.moneyAllocated}
      </p>
      <progress
        className="budget-progress-bar"
        max={props.budget.moneyAllocated}
        value={props.budget.moneySpent}
      ></progress>
      <p className="budget-money-spent">
        Money Spent: ${props.budget.moneySpent}
      </p>
      <p className="budget-money-remaining">
        Money Remaining: ${props.budget.moneyRemaining}
      </p>
      <p></p>
    </div>
  );
};

export default BudgetCard;
