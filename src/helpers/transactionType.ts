import { Transaction } from "../interfaces/transactionInterfaces";

// returns the value of the transaction as a string and if the transaction increased
// or decreased the user's total savings
export type transactionValAndType = {
  value: string;
  add: boolean;
};

export function transactionType(
  transaction: Transaction
): transactionValAndType {
  let returnVal: transactionValAndType = {
    value: `+$${transaction.transaction}`,
    add: true,
  };
  if ("budget" in transaction) {
    returnVal = {
      value: `-$${transaction.transaction}`,
      add: false,
    };
  } else if ("operation" in transaction) {
    if (transaction.operation === "add") {
      returnVal = {
        value: `+$${transaction.transaction}`,
        add: true,
      };
    } else {
      returnVal = {
        value: `-$${transaction.transaction}`,
        add: false,
      };
    }
  }
  return returnVal;
}
