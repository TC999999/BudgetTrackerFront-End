import {
  BudgetListInterface,
  BudgetInterface,
} from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "./getRemainingMoney";

// returns a budget list to be used for a list react component, includes calculation for remaining money
// value in each budget
export const makeBudgetList = (
  budgets: BudgetInterface[]
): BudgetListInterface[] => {
  let listBudgets = budgets.map((b: BudgetInterface) => {
    return {
      _id: b._id,
      title: b.title,
      moneyAllocated: b.moneyAllocated,
      moneySpent: b.moneySpent,
      moneyRemaining: getRemainingMoney(b.moneyAllocated, b.moneySpent),
    };
  });

  return listBudgets;
};
