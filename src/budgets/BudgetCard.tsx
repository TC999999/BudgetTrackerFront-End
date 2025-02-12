import { Link } from "react-router-dom";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

type Props = {
  budget: BudgetListInterface;
};

const BudgetCard: React.FC<Props> = ({ budget }) => {
  return (
    <div className="budget-card border-2 w-full md:w-2/5 xl:w-1/5 my-4 mx-4 shadow-md bg-white rounded-md">
      <div className="px-6 py-4 mx-4 my-4">
        <h3 className="budget-title font-bold text-xl text-center hover:text-green-600 hover:underline active:text-green-100 duration-150">
          <Link to={`/budgets/${budget._id}`}>{budget.title}</Link>
        </h3>

        <div className="budget-money-allocation-div text-center">
          <p className="budget-money-allocation font-mono">
            Total Funds Allocated:
          </p>
          <p className="budget-money-allocation-value text-3xl text-emerald-900">
            ${budget.moneyAllocated}
          </p>
        </div>
        <div className="budget-progress-bar-div my-4 flex justify-center">
          <progress
            className="budget-progress-bar w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400"
            max={budget.moneyAllocated}
            value={budget.moneySpent}
          ></progress>
        </div>
        <div className="fraction-information flex justify-around">
          <div className="budget-money-spend-div text-center">
            <p className="budget-money-spent">Funds</p>
            <p className="budget-money-spent">Spent:</p>
            <p className="budget-money-spent-value text-xl font-bold text-emerald-800">
              ${budget.moneySpent}
            </p>
          </div>
          <div className="budget-money-remaining-div text-center">
            <p className="budget-money-remaining">Funds</p>
            <p className="budget-money-remaining">Remaining:</p>
            <p className="budget-money-remaining-value text-xl font-bold text-emerald-900">
              ${budget.moneyRemaining}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
