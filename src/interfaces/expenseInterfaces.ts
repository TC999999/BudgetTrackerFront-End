export interface newExpenseInterface {
  title: string;
  transaction: number;
}

interface FrontPageExpenseInterface {
  _id: string;
  title: string;
}

export interface ExpenseInterface extends newExpenseInterface {
  date: string;
  budgetID?: FrontPageExpenseInterface;
  _id: string;
}

export interface ExpenseListInterface {
  expenseList: ExpenseInterface[];
}

export interface deleteExpenseInterface {
  _id: string;
  budgetID: string | null;
  transaction: number;
}
