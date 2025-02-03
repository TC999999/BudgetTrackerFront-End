import { ExpenseInterface } from "../interfaces/expenseInterfaces";

export const makeExpenseIDList = (expenses: ExpenseInterface[]) => {
  let expenseIDs = expenses.map((v) => {
    return v._id;
  });

  return expenseIDs;
};
