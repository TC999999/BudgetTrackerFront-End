import {
  handleAddErrors,
  handleSubtractErrors,
  handleUpdateBudgetComparisons,
  handleBudgetInputErrors,
  handleUpdateBudgetInputErrors,
  handleBudgetSubmitErrors,
  handleUpdateBudgetSubmitErrors,
} from "./handleBudgetErrors";
import {
  newBudgetInterface,
  BudgetEditInterface,
} from "../../interfaces/budgetInterfaces";
import { describe, it, expect, beforeAll, vi, Mock } from "vitest";

describe("add error handler", () => {
  it("returns correct string if budget value input is greater than user's total savings", () => {
    expect(handleAddErrors(100, 50)).toBe(
      "New funds cannot be more that total savings."
    );
  });

  it("returns empty string if budget value input is less than user's total savings", () => {
    expect(handleAddErrors(10, 50)).toBe("");
  });
});

describe("subtract error handler", () => {
  it("returns correct string if value input being added to savings is greater than remaining money in budget", () => {
    expect(handleSubtractErrors(100, 50)).toBe(
      "New funds cannot be more than remaining budget funds."
    );
  });

  it("returns empty string if value input being added to savings is less than remaining money in budget", () => {
    expect(handleSubtractErrors(10, 50)).toBe("");
  });
});

describe("budget value comparison handler", () => {
  let setter1: Mock;
  let setter2: Mock;
  let setter3: Mock;
  let setter4: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
    setter3 = vi.fn();
    setter4 = vi.fn();
  });

  it("should return that an error does not exist if numbers are correct when adding to a budget", () => {
    expect(
      handleUpdateBudgetComparisons(100, 50000, "add", 400, setter1)
    ).toBeFalsy();
    expect(setter1).toHaveBeenCalledOnce();
  });

  it("should return that an error does not exist if numbers are correct when subtracting from a budget", () => {
    expect(
      handleUpdateBudgetComparisons(100, 50, "subtract", 400, setter2)
    ).toBeFalsy();
    expect(setter2).toHaveBeenCalledOnce();
  });

  it("should return that an error exists if numbers are incorrect when adding to a budget", () => {
    expect(
      handleUpdateBudgetComparisons(100, 50, "add", 400, setter3)
    ).toBeTruthy();
    expect(setter3).toHaveBeenCalledOnce();
  });

  it("should return that an error exists if numbers are incorrect when subtracting from a budget", () => {
    expect(
      handleUpdateBudgetComparisons(1000, 500, "subtract", 400, setter4)
    ).toBeTruthy();
    expect(setter4).toHaveBeenCalledOnce();
  });
});

describe("input handler for new budget form", () => {
  let setter1: Mock;
  let setter2: Mock;
  let falseSetter: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
    falseSetter = vi.fn();
  });

  it("should call setter function if title input is string type", () => {
    handleBudgetInputErrors("title", "test budget", setter1);
    expect(setter1).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleBudgetInputErrors("title", 500, falseSetter);
    expect(falseSetter).not.toHaveBeenCalledOnce();
  });

  it("should call setter function if value input is number type", () => {
    handleBudgetInputErrors("moneyAllocated", 500, setter2);
    expect(setter2).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleBudgetInputErrors("moneyAllocated", "not a number", falseSetter);
    expect(falseSetter).not.toHaveBeenCalledOnce();
  });
});

describe("input handler for update budget form", () => {
  let setter1: Mock;
  let setter2: Mock;
  let falseSetter: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
    falseSetter = vi.fn();
  });

  it("should call setter function if title input is string type", () => {
    handleUpdateBudgetInputErrors("title", "test budget", setter1);
    expect(setter1).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleUpdateBudgetInputErrors("title", 500, falseSetter);
    expect(falseSetter).not.toHaveBeenCalledOnce();
  });

  it("should call setter function if value input is number type", () => {
    handleUpdateBudgetInputErrors("addedMoney", 500, setter2);
    expect(setter2).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleUpdateBudgetInputErrors("addedMoney", "not a number", falseSetter);
    expect(falseSetter).not.toHaveBeenCalledOnce();
  });
});

describe("submit error handler for new budget form", () => {
  let setter1: Mock;
  let setter2: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
  });

  it("should return true that no errors exist for correct new budget state", () => {
    let newBudget: newBudgetInterface = {
      title: "test budget",
      moneyAllocated: 1000,
    };
    expect(handleBudgetSubmitErrors(newBudget, setter1)).toBeTruthy();
    expect(setter1).toHaveBeenCalledTimes(2);
  });

  it("should return false that errors exist for incorrect new budget state", () => {
    let newBudgetError: newBudgetInterface = {
      title: "This title is way too long to be used for a budget",
      moneyAllocated: 1000,
    };
    expect(handleBudgetSubmitErrors(newBudgetError, setter2)).toBe(false);
    expect(setter2).toHaveBeenCalledTimes(2);
  });
});

describe("submit error handler for update budget form", () => {
  let setter1: Mock;
  let setter2: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
  });

  it("should return true that no errors exist for correct update budget state", () => {
    let editBudget: BudgetEditInterface = {
      title: "test budget",
      addedMoney: 100,
      operation: "add",
    };
    expect(handleUpdateBudgetSubmitErrors(editBudget, setter1)).toBe(true);
    expect(setter1).toHaveBeenCalledTimes(1);
  });

  it("should return false that errors exist for incorrect new budget state", () => {
    let editBudgetError: BudgetEditInterface = {
      title: "This title is way too long to be used for a budget",
      addedMoney: 100,
      operation: "add",
    };
    expect(handleUpdateBudgetSubmitErrors(editBudgetError, setter2)).toBe(
      false
    );
    expect(setter2).toHaveBeenCalledTimes(1);
  });
});
