import { ExpenseInterface } from "../interfaces/expenseInterfaces";

// used for delete budget form: returns a list of ids for expenses
export const makeExpenseIDList = (expenses: ExpenseInterface[]) => {
  let expenseIDs = expenses.map((v) => {
    return v._id;
  });

  return expenseIDs;
};
