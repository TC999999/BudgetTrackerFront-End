export interface newExpenseInterface {
  title: string;
  transaction: number;
}

type FrontPageExpenseInterface = {
  _id: string;
  title: string;
};

export interface ExpenseInterface extends newExpenseInterface {
  date: string;
  budgetID?: FrontPageExpenseInterface;
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
