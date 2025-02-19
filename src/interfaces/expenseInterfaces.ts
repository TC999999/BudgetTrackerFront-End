export interface newExpenseInterface {
  title: string;
  transaction: number;
  date: string;
}

type ExpenseBudgetInterface = {
  _id: string;
  title: string;
};

export interface ExpenseInterface extends newExpenseInterface {
  budget?: ExpenseBudgetInterface;
  _id: string;
}

export type ExpenseListInterface = {
  expenseList: ExpenseInterface[];
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
