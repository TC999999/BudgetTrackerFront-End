import { BudgetInterface } from "../interfaces/budgetInterfaces";

export const getCurrentBudget = (
  budgets: BudgetInterface[],
  id: string
): BudgetInterface => {
  let arr = budgets.filter((b) => {
    return b._id === id;
  });
  return arr[0];
};
