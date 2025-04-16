import { Transaction } from "../interfaces/transactionInterfaces";

// inserts a new transaction into an array of previous transactions and sorts them by date as well as pushes out the
// last transaction on the list
export const addNewTransaction = (
  transactions: Transaction[],
  newTransaction: Transaction[]
): Transaction[] => {
  let arr: Transaction[] = [];
  let i = 0;
  let j = 0;
  while (i < transactions.length && j < newTransaction.length) {
    if (transactions[i].date <= newTransaction[j].date) {
      arr.push(newTransaction[j]);
      j++;
    } else {
      arr.push(transactions[i]);
      i++;
    }
  }
  while (j < newTransaction.length) {
    arr.push(newTransaction[j]);
    j++;
  }
  while (i < transactions.length) {
    arr.push(transactions[i]);
    i++;
  }
  arr.pop();
  return arr;
};
