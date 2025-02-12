import { ExpenseInterface } from "./expenseInterfaces";

export type newBudgetInterface = {
  title: string;
  moneyAllocated: number;
};

export type BudgetEditInterface = {
  title: string;
  addedMoney: number;
  operation: string;
};

export type SubmitBudgetUpdateInterface = {
  title: string;
  addedMoney: number;
  budgetID: string;
};

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

export type DeleteBudgetInterface = {
  addBackToAssets: number;
  budgetID: string;
  expenses: string[];
};

export type BudgetFormErrors = {
  title: string;
  moneyAllocated: string;
};
