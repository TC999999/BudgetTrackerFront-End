import {
  BudgetListInterface,
  BudgetInterface,
} from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "./getRemainingMoney";

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
