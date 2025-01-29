export interface newExpenseInterface {
  title: string;
  transaction: number;
  date: Date | null;
}

export interface ExpenseInterface extends newExpenseInterface {
  budget: string;
}

export interface ExpenseListInterface {
  expenseList: ExpenseInterface[];
}
