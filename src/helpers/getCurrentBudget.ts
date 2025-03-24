import { BudgetInterface } from "../interfaces/budgetInterfaces";

// returns the budget with the inputted id from an array of budgets or undefined if id is not in array
export const getCurrentBudget = (
  budgets: BudgetInterface[],
  id: string
): BudgetInterface => {
  let arr = budgets.filter((b) => {
    return b._id === id;
  });
  return arr[0];
};
