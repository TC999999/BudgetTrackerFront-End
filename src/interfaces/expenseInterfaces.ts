export interface newExpenseInterface {
  title: string;
  transaction: number;
  date: string;
}

export type submitNewExpense = {
  budgetID: string;
  title: string;
  transaction: number;
  date: string;
};

type ExpenseBudgetInterface = {
  _id: string;
  title: string;
};

export interface ExpenseInterface extends newExpenseInterface {
  budget?: ExpenseBudgetInterface;
  _id: string;
}

type TransactionExpenseBudget = {
  title: string;
};

export type TransactionExpense = {
  _id: string;
  title: string;
  budget: TransactionExpenseBudget;
  transaction: string;
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
