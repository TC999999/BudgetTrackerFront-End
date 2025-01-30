import { useMemo } from "react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "../helpers/getRemainingMoney";

interface Props {
  budget: BudgetInterface | null;
}

const BudgetPageCard: React.FC<Props> = (props) => {
  const moneyRemaining = useMemo(
    () =>
      getRemainingMoney(
        props.budget?.moneyAllocated || "",
        props.budget?.moneySpent || 0
      ),
    [props.budget]
  );

  return (
    <div className="budget-page-card">
      <h3 className="budget-title">{props.budget?.title}</h3>

      <p className="budget-allocated-money">
        Total Money Allocated: ${props.budget?.moneyAllocated}
      </p>
      <progress
        className="budget-progress-bar"
        max={props.budget?.moneyAllocated}
        value={props.budget?.moneySpent}
      ></progress>
      <p className="budget-money-spend">
        Money Spent: ${props.budget?.moneySpent}
      </p>
      <p className="budget-money-remaining">
        Money Remaining: ${moneyRemaining}
      </p>
    </div>
  );
};

export default BudgetPageCard;
