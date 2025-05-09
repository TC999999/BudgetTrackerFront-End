import { Transaction } from "../interfaces/transactionInterfaces";
import { dollarConverter } from "./currencyConverter";

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
    // value: `+$${transaction.transaction}`,
    value: `+${dollarConverter(transaction.transaction)}`,
    add: true,
  };
  if ("budget" in transaction) {
    returnVal = {
      value: `-${dollarConverter(transaction.transaction)}`,
      add: false,
    };
  } else if ("operation" in transaction) {
    if (transaction.operation === "add") {
      returnVal = {
        value: `+${dollarConverter(transaction.transaction)}`,
        add: true,
      };
    } else {
      returnVal = {
        value: `-${dollarConverter(transaction.transaction)}`,
        add: false,
      };
    }
  }
  return returnVal;
}
