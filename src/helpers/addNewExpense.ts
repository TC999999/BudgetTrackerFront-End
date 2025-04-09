import { ExpenseInterface } from "../interfaces/expenseInterfaces";

// inserts a new expense into an array of previous expenses and sorts them by date
export const addNewExpense = (
  expenses: ExpenseInterface[],
  newExpense: ExpenseInterface[]
): ExpenseInterface[] => {
  let arr: ExpenseInterface[] = [];
  let i = 0;
  let j = 0;
  while (i < expenses.length && j < newExpense.length) {
    if (expenses[i].date <= newExpense[j].date) {
      arr.push(newExpense[j]);
      j++;
    } else {
      arr.push(expenses[i]);
      i++;
    }
  }
  while (j < newExpense.length) {
    arr.push(newExpense[j]);
    j++;
  }
  while (i < expenses.length) {
    arr.push(expenses[i]);
    i++;
  }
  return arr;
};
