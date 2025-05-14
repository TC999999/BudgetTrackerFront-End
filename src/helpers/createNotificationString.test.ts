import { NewTransactionUI } from "../interfaces/transactionInterfaces";
import { Income, SubmitUpdateIncome } from "../interfaces/incomeInterfaces";
import { BudgetEditInterface } from "../interfaces/budgetInterfaces";
import {
  createUpdateUserString,
  createUpdateIncomeString,
  createUpdateBudgetString,
} from "./createNotificationString";
import { describe, it, expect, beforeEach, beforeAll } from "vitest";

describe("helper functions for creating strings for toast notifications when adding a transaction", () => {
  it("should create a string using data for a new transaction when adding to balance", () => {
    const newTransaction: NewTransactionUI = {
      _id: "1",
      title: "new transaction",
      value: 200,
      date: "2025-01-01T00:00:00.000+00:00",
    };

    expect(createUpdateUserString(newTransaction)).toBe(
      "Sucessfully noted transaction! Added $200.00 to total savings balance."
    );
  });

  it("should create a string using data for a new transaction when subtracting from balance", () => {
    const newTransaction: NewTransactionUI = {
      _id: "2",
      title: "new transaction",
      value: -200,
      date: "2025-01-01T00:00:00.000+00:00",
    };

    expect(createUpdateUserString(newTransaction)).toBe(
      "Sucessfully noted transaction! Removed $200.00 from total savings balance."
    );
  });
});

describe("helper function for creating strings for toast notifications when updating an income", () => {
  let incomeUpdate: Income;
  let submitUpdateIncome: SubmitUpdateIncome;

  beforeAll(() => {
    incomeUpdate = {
      _id: "1",
      title: "test income",
      salary: 300,
      cronString: "0 12 * * 3",
      readableUpdateTimeString: "Noon on every Wednesday",
      lastReceived: "2025-04-30T12:00:00.000+00:00",
      nextReceived: "2025-05-07T12:00:00.000+00:00",
    };
  });

  beforeEach(() => {
    submitUpdateIncome = {
      _id: "1",
      title: "test income",
      salary: 300,
      cronString: "0 12 * * 3",
      readableUpdateTimeString: "Noon on every Wednesday",
    };
  });

  it("should only mention title update when only title is updated", () => {
    submitUpdateIncome.title = "new test income";

    expect(createUpdateIncomeString(incomeUpdate, submitUpdateIncome)).toBe(
      "test income income successfully updated! Title changed to new test income."
    );
  });

  it("should only mention salary update when only salary is updated", () => {
    submitUpdateIncome.salary = 400;

    expect(createUpdateIncomeString(incomeUpdate, submitUpdateIncome)).toBe(
      "test income income successfully updated! Salary changed to $400.00."
    );
  });

  it("should only mention interval update when only interval is updated", () => {
    submitUpdateIncome.cronString = "0 12 * * 4";
    submitUpdateIncome.readableUpdateTimeString = "Noon on every Thursday";

    expect(createUpdateIncomeString(incomeUpdate, submitUpdateIncome)).toBe(
      "test income income successfully updated! Now updates at Noon on every Thursday."
    );
  });

  it("should only mention all 3 updated parameters update when all are updated", () => {
    submitUpdateIncome.title = "new test income";
    submitUpdateIncome.salary = 400;
    submitUpdateIncome.cronString = "0 12 * * 4";
    submitUpdateIncome.readableUpdateTimeString = "Noon on every Thursday";

    expect(createUpdateIncomeString(incomeUpdate, submitUpdateIncome)).toBe(
      "test income income successfully updated! Title changed to new test income. Salary changed to $400.00. Now updates at Noon on every Thursday."
    );
  });

  describe("helper function for creating strings for toast notifications when updating a budget", () => {
    let originalTitle: string;
    let budgetUpdate: BudgetEditInterface;

    beforeAll(() => {
      originalTitle = "original budget title";
    });

    beforeEach(() => {
      budgetUpdate = {
        title: "original budget title",
        addedMoney: 0,
        operation: "add",
      };
    });

    it("should only mention updated title when only title is updated", () => {
      budgetUpdate.title = "new budget title";
      expect(createUpdateBudgetString(originalTitle, budgetUpdate)).toBe(
        "original budget title budget updated successfully! Title changed to new budget title."
      );
    });
  });
});
