import { Transaction } from "../interfaces/transactionInterfaces";
import { addNewTransaction } from "./addNewTransaction";
import { describe, it, expect, beforeEach } from "vitest";

describe("helper function for adding a new transaction to the list", () => {
  let transactions: Transaction[];
  let newTransaction: Transaction[];

  beforeEach(() => {
    transactions = [
      {
        _id: "4",
        date: "2025-01-07T00:00:00.000+00:00",
        title: "new transaction 4",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
      {
        _id: "3",
        date: "2025-01-05T00:00:00.000+00:00",
        title: "new transaction 3",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },

      {
        _id: "2",
        date: "2025-01-03T00:00:00.000+00:00",
        title: "new transaction 2",
        transaction: "500",
        fromIncome: false,
        operation: "add",
      },
      {
        _id: "1",
        date: "2025-01-01T00:00:00.000+00:00",
        title: "new transaction 1",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },
    ];

    newTransaction = [
      {
        _id: "5",
        date: "",
        title: "new transaction 5",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
    ];
  });

  it("should add a recent new transaction to top of list", () => {
    newTransaction[0].date = "2025-01-10T00:00:00.000+00:00";
    expect(addNewTransaction(transactions, newTransaction)).toStrictEqual([
      {
        _id: "5",
        date: "2025-01-10T00:00:00.000+00:00",
        title: "new transaction 5",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
      {
        _id: "4",
        date: "2025-01-07T00:00:00.000+00:00",
        title: "new transaction 4",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
      {
        _id: "3",
        date: "2025-01-05T00:00:00.000+00:00",
        title: "new transaction 3",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },

      {
        _id: "2",
        date: "2025-01-03T00:00:00.000+00:00",
        title: "new transaction 2",
        transaction: "500",
        fromIncome: false,
        operation: "add",
      },
      {
        _id: "1",
        date: "2025-01-01T00:00:00.000+00:00",
        title: "new transaction 1",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },
    ]);
  });

  it("should add a new transaction with an earlier date than all other transactions to bottom of list", () => {
    newTransaction[0].date = "2024-12-29T00:00:00.000+00:00";
    expect(addNewTransaction(transactions, newTransaction)).toStrictEqual([
      {
        _id: "4",
        date: "2025-01-07T00:00:00.000+00:00",
        title: "new transaction 4",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
      {
        _id: "3",
        date: "2025-01-05T00:00:00.000+00:00",
        title: "new transaction 3",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },
      {
        _id: "2",
        date: "2025-01-03T00:00:00.000+00:00",
        title: "new transaction 2",
        transaction: "500",
        fromIncome: false,
        operation: "add",
      },
      {
        _id: "1",
        date: "2025-01-01T00:00:00.000+00:00",
        title: "new transaction 1",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },
      {
        _id: "5",
        date: "2024-12-29T00:00:00.000+00:00",
        title: "new transaction 5",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
    ]);
  });

  it("should add a new transaction with a date between the dates of all other transactions the middle of list", () => {
    newTransaction[0].date = "2025-01-02T00:00:00.000+00:00";
    expect(addNewTransaction(transactions, newTransaction)).toStrictEqual([
      {
        _id: "4",
        date: "2025-01-07T00:00:00.000+00:00",
        title: "new transaction 4",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
      {
        _id: "3",
        date: "2025-01-05T00:00:00.000+00:00",
        title: "new transaction 3",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },
      {
        _id: "2",
        date: "2025-01-03T00:00:00.000+00:00",
        title: "new transaction 2",
        transaction: "500",
        fromIncome: false,
        operation: "add",
      },
      {
        _id: "5",
        date: "2025-01-02T00:00:00.000+00:00",
        title: "new transaction 5",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
      {
        _id: "1",
        date: "2025-01-01T00:00:00.000+00:00",
        title: "new transaction 1",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },
    ]);
  });

  it("should never have a length greater than 5: if more than one transaction is added, pushes out the earliest transaction from the bottom of the list", () => {
    newTransaction[0].date = "2025-01-02T00:00:00.000+00:00";

    transactions = addNewTransaction(transactions, [
      {
        _id: "6",
        date: "2025-01-10T00:00:00.000+00:00",
        title: "new transaction 6",
        transaction: "500",
        fromIncome: false,
        operation: "add",
      },
    ]);
    expect(addNewTransaction(transactions, newTransaction)).toStrictEqual([
      {
        _id: "6",
        date: "2025-01-10T00:00:00.000+00:00",
        title: "new transaction 6",
        transaction: "500",
        fromIncome: false,
        operation: "add",
      },
      {
        _id: "4",
        date: "2025-01-07T00:00:00.000+00:00",
        title: "new transaction 4",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
      {
        _id: "3",
        date: "2025-01-05T00:00:00.000+00:00",
        title: "new transaction 3",
        transaction: "500",
        fromIncome: false,
        operation: "subtract",
      },
      {
        _id: "2",
        date: "2025-01-03T00:00:00.000+00:00",
        title: "new transaction 2",
        transaction: "500",
        fromIncome: false,
        operation: "add",
      },
      {
        _id: "5",
        date: "2025-01-02T00:00:00.000+00:00",
        title: "new transaction 5",
        transaction: "500",
        fromIncome: true,
        operation: "add",
      },
    ]);
  });
});
