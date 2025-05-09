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
  operation: "add" | "subtract";
};

export type BudgetUpdate = {
  title?: string;
  moneyAllocated?: number;
  moneySpent?: number;
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
  moneyAllocated: number;
  moneySpent: number;
}

export interface BudgetListInterface extends BudgetInterface {
  moneyRemaining: number;
}

export type DeleteBudgetInterface = {
  user: string;
  addBackToAssets: number;
  budgetID: string;
};

export type BudgetFormErrors = {
  title: string;
  moneyAllocated: string;
};

export type BudgetFlashErrors = {
  title: boolean;
  moneyAllocated: boolean;
};

export type UpdateBudgetFlashErrors = {
  title: boolean;
};

export type UpdateBudgetFormErrors = {
  title: string;
  addedMoney: string;
};

export type budgetFunds = { moneySpent: number; moneyRemaining: number };
