// import { ExpenseInterface } from "./expenseInterfaces";

export type newBudgetInterface = {
  title: string;
  moneyAllocated: number;
};

export type submitBudget = {
  userID: string;
  title: string;
  moneyAllocated: number;
};

export type BudgetEditInterface = {
  title: string;
  addedMoney: number;
  operation: string;
};

export type SubmitBudgetUpdateInterface = {
  userID: string;
  title: string;
  addedMoney: number;
  budgetID: string;
};

export interface BudgetInterface {
  _id: string;
  title: string;
  moneyAllocated: string;
  moneySpent: number;
}

export interface BudgetListInterface extends BudgetInterface {
  moneyRemaining: string;
}

export type DeleteBudgetInterface = {
  addBackToAssets: number;
  budgetID: string;
};

export type BudgetFormErrors = {
  title: string;
  moneyAllocated: string;
};

export type UpdateBudgetFormErrors = {
  title: string;
  addedMoney: string;
};
