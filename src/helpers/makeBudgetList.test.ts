import { describe, it, expect, beforeAll } from "vitest";
import { makeBudgetList } from "./makeBudgetList";
import { BudgetInterface } from "../interfaces/budgetInterfaces";

describe("Make Readable Budget List Helper Function", () => {
  let budgetList: BudgetInterface[];

  beforeAll(() => {
    budgetList = [
      {
        _id: "1",
        title: "test budget 1",
        moneyAllocated: 500,
        moneySpent: 100,
      },
      {
        _id: "2",
        title: "test budget 2",
        moneyAllocated: 1000,
        moneySpent: 0,
      },
      {
        _id: "3",
        title: "test budget 3",
        moneyAllocated: 500,
        moneySpent: 500,
      },

      {
        _id: "4",
        title: "test budget 4",
        moneyAllocated: 700,
        moneySpent: 455.88,
      },
    ];
  });

  it("should make a list of budgets that include money remaining as well", () => {
    expect(makeBudgetList(budgetList)).toStrictEqual([
      {
        _id: "1",
        title: "test budget 1",
        moneyAllocated: 500,
        moneySpent: 100,
        moneyRemaining: 400,
      },
      {
        _id: "2",
        title: "test budget 2",
        moneyAllocated: 1000,
        moneySpent: 0,
        moneyRemaining: 1000,
      },
      {
        _id: "3",
        title: "test budget 3",
        moneyAllocated: 500,
        moneySpent: 500,
        moneyRemaining: 0,
      },

      {
        _id: "4",
        title: "test budget 4",
        moneyAllocated: 700,
        moneySpent: 455.88,
        moneyRemaining: 244.12,
      },
    ]);
  });
});
