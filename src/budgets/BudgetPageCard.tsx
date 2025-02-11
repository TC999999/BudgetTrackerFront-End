import { useMemo } from "react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "../helpers/getRemainingMoney";

type Props = {
  budget: BudgetInterface | null;
};

const BudgetPageCard: React.FC<Props> = ({ budget }) => {
  const moneyRemaining: string = useMemo<string>(
    () =>
      getRemainingMoney(budget?.moneyAllocated || "", budget?.moneySpent || 0),
    [budget]
  );

  return (
    <div className="budget-page-card border-2 px-6 py-4 mx-4 my-4 shadow-md rounded-lg bg-white">
      <h3 className="budget-title text-4xl text-center text-emerald-800 font-bold">
        {budget?.title}
      </h3>

      <div className="text-center">
        <p className="budget-allocated-money">Total Money Allocated:</p>
        <p className="text-green-700 text-3xl font-bold">
          ${budget?.moneyAllocated}
        </p>
      </div>
      <div className="budget-progress-bar-div my-4 flex justify-center">
        <progress
          className="budget-progress-bar w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400"
          max={budget?.moneyAllocated}
          value={budget?.moneySpent}
        ></progress>
      </div>
      <div className="fraction-information grid grid-cols-5">
        <div className="budget-money-spend-div text-center col-start-1 col-end-3">
          <p className="budget-money-spend">Money Spent:</p>
          <p className="text-green-700 text-xl font-bold">
            ${budget?.moneySpent}
          </p>
        </div>
        <div className="budget-money-remaining-div text-center col-start-4 col-end-6">
          <p className="budget-money-remaining">Money Remaining:</p>
          <p className="text-green-700 text-xl font-bold"> ${moneyRemaining}</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetPageCard;
