import { addNewExpense } from "./addNewExpense";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import { describe, it, expect, beforeEach } from "vitest";

describe("Adds new expenses helper function", () => {
  let newExpense: ExpenseInterface[];
  let expenseList: ExpenseInterface[];

  beforeEach(() => {
    expenseList = [
      {
        _id: "4",
        date: "2025-01-04T00:00:00.000+00:00",
        title: "new expense 4",
        transaction: 500,
      },
      {
        _id: "2",
        date: "2025-01-02T00:00:00.000+00:00",
        title: "new expense 2",
        transaction: 500,
      },
    ];
  });

  it("adds the new expense in by date in the middle", () => {
    newExpense = [
      {
        _id: "3",
        date: "2025-01-03T00:00:00.000+00:00",
        title: "new expense 3",
        transaction: 500,
      },
    ];
    expect(addNewExpense(newExpense, expenseList)).toStrictEqual([
      {
        _id: "4",
        date: "2025-01-04T00:00:00.000+00:00",
        title: "new expense 4",
        transaction: 500,
      },
      {
        _id: "3",
        date: "2025-01-03T00:00:00.000+00:00",
        title: "new expense 3",
        transaction: 500,
      },
      {
        _id: "2",
        date: "2025-01-02T00:00:00.000+00:00",
        title: "new expense 2",
        transaction: 500,
      },
    ]);
  });

  it("adds the new expense in by date at the beginning", () => {
    newExpense = [
      {
        _id: "1",
        date: "2025-01-01T00:00:00.000+00:00",
        title: "new expense 1",
        transaction: 500,
      },
    ];
    expect(addNewExpense(newExpense, expenseList)).toStrictEqual([
      {
        _id: "4",
        date: "2025-01-04T00:00:00.000+00:00",
        title: "new expense 4",
        transaction: 500,
      },
      {
        _id: "2",
        date: "2025-01-02T00:00:00.000+00:00",
        title: "new expense 2",
        transaction: 500,
      },
      {
        _id: "1",
        date: "2025-01-01T00:00:00.000+00:00",
        title: "new expense 1",
        transaction: 500,
      },
    ]);
  });

  it("adds the new expense in by date at the end", () => {
    newExpense = [
      {
        _id: "5",
        date: "2025-01-05T00:00:00.000+00:00",
        title: "new expense 5",
        transaction: 500,
      },
    ];
    expect(addNewExpense(newExpense, expenseList)).toStrictEqual([
      {
        _id: "5",
        date: "2025-01-05T00:00:00.000+00:00",
        title: "new expense 5",
        transaction: 500,
      },
      {
        _id: "4",
        date: "2025-01-04T00:00:00.000+00:00",
        title: "new expense 4",
        transaction: 500,
      },
      {
        _id: "2",
        date: "2025-01-02T00:00:00.000+00:00",
        title: "new expense 2",
        transaction: 500,
      },
    ]);
  });
});
