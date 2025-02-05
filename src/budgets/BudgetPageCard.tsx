import { useMemo } from "react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "../helpers/getRemainingMoney";

interface Props {
  budget: BudgetInterface | null;
}

const BudgetPageCard: React.FC<Props> = (props) => {
  const moneyRemaining: string = useMemo<string>(
    () =>
      getRemainingMoney(
        props.budget?.moneyAllocated || "",
        props.budget?.moneySpent || 0
      ),
    [props.budget]
  );

  return (
    <div className="budget-page-card border-2 px-6 py-4 mx-4 my-4 shadow-md">
      <h3 className="budget-title text-xl text-center ">
        {props.budget?.title}
      </h3>

      <p className="budget-allocated-money text-center">
        Total Money Allocated: ${props.budget?.moneyAllocated}
      </p>
      <div className="budget-progress-bar-div grid grid-cols-7 my-4">
        <progress
          className="budget-progress-bar col-span-4 col-start-2 w-96 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-slate-300 [&::-webkit-progress-value]:bg-green-400 [&::-moz-progress-bar]:bg-green-400"
          max={props.budget?.moneyAllocated}
          value={props.budget?.moneySpent}
        ></progress>
      </div>
      <div className="fraction-information grid grid-cols-5">
        <div className="budget-money-spend-div col-start-1 col-end-3">
          <p className="budget-money-spend">
            Money Spent: ${props.budget?.moneySpent}
          </p>
        </div>
        <div className="budget-money-remaining-div col-start-4 col-end-6">
          <p className="budget-money-remaining">
            Money Remaining: ${moneyRemaining}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetPageCard;
