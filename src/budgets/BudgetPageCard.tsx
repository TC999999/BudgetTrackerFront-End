import { useState, useEffect } from "react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "../helpers/getRemainingMoney";

interface Props {
  budget: BudgetInterface | null;
}

const BudgetPageCard: React.FC<Props> = (props) => {
  const [moneyRemaining, setMoneyRemaining] = useState<string>("");

  useEffect(() => {
    setMoneyRemaining(
      getRemainingMoney(
        props.budget?.moneyAllocated || "",
        props.budget?.moneySpent || 0
      )
    );
  }, []);

  return (
    <div className="budget-page-card">
      <h3>{props.budget?.title}</h3>

      <p>Total Money Allocated: ${props.budget?.moneyAllocated}</p>
      <progress
        className="budget-progress-bar"
        max={props.budget?.moneyAllocated}
        value={props.budget?.moneySpent}
      ></progress>
      <p>Money Spent: ${props.budget?.moneySpent}</p>
      <p>Money Remaining: ${moneyRemaining}</p>
      <p></p>
    </div>
  );
};

export default BudgetPageCard;
