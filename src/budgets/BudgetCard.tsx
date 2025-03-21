import { Link } from "react-router-dom";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

type Props = {
  budget: BudgetListInterface;
};

// returns budget card to be displayed in BudgetList component
const BudgetCard: React.FC<Props> = ({ budget }): JSX.Element => {
  return (
    <div className="budget-card border-2 border-green-400 p-8 m-4 shadow-md bg-white rounded-md">
      <header className="text-center">
        <h3 className="budget-title font-bold text-xl hover:text-green-600 hover:underline active:text-green-100 duration-150">
          <Link to={`/budgets/${budget._id}`}>{budget.title}</Link>
        </h3>
        <p className="budget-money-allocation font-mono">
          Total Funds Allocated:
        </p>
        <p className="budget-money-allocation-value text-3xl text-green-900">
          ${budget.moneyAllocated}
        </p>
      </header>
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
          <p className="budget-money-spent-value text-xl font-bold text-green-900">
            ${budget.moneySpent}
          </p>
        </div>
        <div className="budget-money-remaining-div text-center">
          <p className="budget-money-remaining">Funds</p>
          <p className="budget-money-remaining">Remaining:</p>
          <p className="budget-money-remaining-value text-xl font-bold text-green-900">
            ${budget.moneyRemaining}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
