export interface newExpenseInterface {
  title: string;
  transaction: number;
}

export interface ExpenseInterface extends newExpenseInterface {
  date: string;
  _id: string;
}

export interface ExpenseListInterface {
  expenseList: ExpenseInterface[];
}
