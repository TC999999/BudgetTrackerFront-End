import { TransactionExpense } from "./expenseInterfaces";

export type Transaction = {
  _id: string;
  date: string;
  fromIncome: boolean;
  operation: "add" | "subtract";
  title: string;
  transaction: string;
};

export type TransactionExpenseList = (Transaction | TransactionExpense)[];
