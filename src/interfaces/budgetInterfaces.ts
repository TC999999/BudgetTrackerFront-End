import { ExpenseInterface } from "./expenseInterfaces";

export interface newBudgetInterface {
  title: string;
  moneyAllocated: number;
}

interface BaseBudgetInterface {
  _id: string;
  title: string;
  moneyAllocated: string;
  moneySpent: number;
}

export interface BudgetListInterface extends BaseBudgetInterface {
  moneyRemaining: string;
}

export interface BudgetInterface extends BaseBudgetInterface {
  expenses: ExpenseInterface[];
}

export interface DeleteBudgetInterface {
  addBackToAssets: number;
  budgetID: string;
  expenses: string[];
}
