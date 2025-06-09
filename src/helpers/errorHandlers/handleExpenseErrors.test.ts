import { describe, it, expect, beforeAll, vi, Mock } from "vitest";
import {
  handleExpenseInputErrors,
  handleExpenseSubmitErrors,
} from "./handleExpenseErrors";
import { newExpenseInterface } from "../../interfaces/expenseInterfaces";

describe("input handler for new expense", () => {
  let setter1: Mock;
  let setter2: Mock;
  let setter3: Mock;
  let falseSetter: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
    setter3 = vi.fn();
    falseSetter = vi.fn();
  });

  it("should call the setter once for a single handle of a title input", () => {
    handleExpenseInputErrors("title", "test expense", setter1);
    expect(setter1).toHaveBeenCalledOnce();
  });

  it("should call the setter once for a single handle of a transaction value input", () => {
    handleExpenseInputErrors("transaction", 100, setter2);
    expect(setter2).toHaveBeenCalledOnce();
  });

  it("should call the setter once for a single handle of a date input", () => {
    handleExpenseInputErrors("date", "01-01-2025", setter3);
    expect(setter3).toHaveBeenCalledOnce();
  });

  it("should not call setter if typing between name and value for title is mismatched", () => {
    handleExpenseInputErrors("title", 100, falseSetter);
    expect(falseSetter).not.toHaveBeenCalled();
  });

  it("should not call setter if typing between name and value for transaction is mismatched", () => {
    handleExpenseInputErrors("transaction", "NAN", falseSetter);
    expect(falseSetter).not.toHaveBeenCalled();
  });

  it("should not call setter if typing between name and value for date is mismatched", () => {
    handleExpenseInputErrors("date", 100, falseSetter);
    expect(falseSetter).not.toHaveBeenCalled();
  });
});

describe("submit handler for new expense", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call the setter three times and return true for new expense data with no errors", () => {
    let newExpense: newExpenseInterface = {
      title: "new expense",
      transaction: 1000,
      date: "01-01-2025",
    };
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should return false for new expense data with title error", () => {
    let newExpense: newExpenseInterface = {
      title: "This expense title is way too long to be used",
      transaction: 1000,
      date: "01-01-2025",
    };
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(false);
  });

  it("should return false for new expense data with transaction error", () => {
    let newExpense: newExpenseInterface = {
      title: "new expense",
      transaction: 0,
      date: "01-01-2025",
    };
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(false);
  });

  it("should return false for new expense data with date error", () => {
    let newExpense: newExpenseInterface = {
      title: "new expense",
      transaction: 1000,
      date: "",
    };
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(false);
  });
});
