import { Link } from "react-router-dom";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

interface Props {
  budget: BudgetListInterface;
}

const BudgetCard: React.FC<Props> = (props) => {
  return (
    <div className="budget-card border-2 px-6 py-4 mx-4 my-4 shadow-md">
      <h3 className="budget-title text-xl text-center hover:text-green-600 hover:underline active:text-green-100">
        <Link to={`/budgets/${props.budget._id}`}>{props.budget.title}</Link>
      </h3>

      <p className="budget-money-allocation text-center">
        Total Money Allocated: ${props.budget.moneyAllocated}
      </p>
      <div className="budget-progress-bar-div my-4 flex justify-center">
        <progress
          className="budget-progress-bar w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400"
          max={props.budget.moneyAllocated}
          value={props.budget.moneySpent}
        ></progress>
      </div>
      <div className="fraction-information grid grid-cols-5">
        <div className="budget-money-spend-div col-start-1 col-end-3">
          <p className="budget-money-spent">
            Money Spent: ${props.budget.moneySpent}
          </p>
        </div>
        <div className="budget-money-remaining-div col-start-4 col-end-6">
          <p className="budget-money-remaining">
            Money Remaining: ${props.budget.moneyRemaining}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
