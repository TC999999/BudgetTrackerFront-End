export type newExpenseInterface = {
  title: string;
  transaction: number;
  date: string;
};

export type submitNewExpense = {
  budgetID: string;
  title: string;
  transaction: number;
  date: string;
};

export type ExpenseInterface = {
  _id: string;
  title: string;
  transaction: number;
  date: string;
};

export type deleteExpenseInterface = {
  _id: string;
  budgetID: string | null;
  transaction: number;
};

export type ExpenseFormErrors = {
  title: string;
  transaction: string;
  date: string;
};

export type ExpenseFlashErrors = {
  title: boolean;
  transaction: boolean;
  date: boolean;
};

export type RecentExpense = {
  _id: string;
  title: string;
  transaction: number;
  date: string;
  budget: string;
  budgetID: string;
};
