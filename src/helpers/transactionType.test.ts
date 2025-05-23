import { describe, it, expect, beforeAll } from "vitest";
import { transactionType } from "./transactionType";
import { Transaction } from "../interfaces/transactionInterfaces";

describe("helper function that returns if a transaction adds to a user's total savings", () => {
  let t1: Transaction;
  let t2: Transaction;

  beforeAll(() => {
    t1 = {
      _id: "1",
      date: "01-01-2024",
      fromIncome: true,
      operation: "add",
      title: "test transaction 1",
      transaction: 1000,
      budgetOperation: "-",
      newBalance: 5000,
    };

    t2 = {
      _id: "2",
      date: "01-01-2024",
      fromIncome: true,
      operation: "subtract",
      title: "test budget 1",
      transaction: 1000,
      budgetOperation: "Created",
      newBalance: 4000,
    };
  });

  it("should return the proper string and operation", () => {
    expect(transactionType(t1)).toStrictEqual({
      value: "+$1,000.00",
      add: true,
    });
    expect(transactionType(t2)).toStrictEqual({
      value: "-$1,000.00",
      add: false,
    });
  });
});
