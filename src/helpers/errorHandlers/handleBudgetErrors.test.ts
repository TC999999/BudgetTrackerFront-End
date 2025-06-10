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
import {
  describe,
  it,
  expect,
  beforeAll,
  vi,
  Mock,
  afterEach,
  beforeEach,
} from "vitest";

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
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should return that an error does not exist if numbers are correct when adding to a budget", () => {
    expect(
      handleUpdateBudgetComparisons(100, 50000, "add", 400, setter)
    ).toBeFalsy();
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should return that an error does not exist if numbers are correct when subtracting from a budget", () => {
    expect(
      handleUpdateBudgetComparisons(100, 50, "subtract", 400, setter)
    ).toBeFalsy();
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should return that an error exists if numbers are incorrect when adding to a budget", () => {
    expect(
      handleUpdateBudgetComparisons(100, 50, "add", 400, setter)
    ).toBeTruthy();
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should return that an error exists if numbers are incorrect when subtracting from a budget", () => {
    expect(
      handleUpdateBudgetComparisons(1000, 500, "subtract", 400, setter)
    ).toBeTruthy();
    expect(setter).toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("input error handler for new budget form", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter function if title input is string type", () => {
    handleBudgetInputErrors("title", "test budget", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleBudgetInputErrors("title", 500, setter);
    expect(setter).not.toHaveBeenCalledOnce();
  });

  it("should call setter function if value input is number type", () => {
    handleBudgetInputErrors("moneyAllocated", 500, setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleBudgetInputErrors("moneyAllocated", "not a number", setter);
    expect(setter).not.toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("input error handler for update budget form", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter function if title input is string type", () => {
    handleUpdateBudgetInputErrors("title", "test budget", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleUpdateBudgetInputErrors("title", 500, setter);
    expect(setter).not.toHaveBeenCalledOnce();
  });

  it("should call setter function if value input is number type", () => {
    handleUpdateBudgetInputErrors("addedMoney", 500, setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter function if title input is not string type", () => {
    handleUpdateBudgetInputErrors("addedMoney", "not a number", setter);
    expect(setter).not.toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("submit error handler for new budget form", () => {
  let setter: Mock;
  let newBudget: newBudgetInterface;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    newBudget = {
      title: "test budget",
      moneyAllocated: 1000,
    };
  });

  it("should call setter twice and return true when all new budget is valid", () => {
    expect(handleBudgetSubmitErrors(newBudget, setter)).toBeTruthy();
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when title data is invalid", () => {
    newBudget.title = " test *&bu^!udget   ";
    expect(handleBudgetSubmitErrors(newBudget, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when allocated funds data is invalid", () => {
    newBudget.moneyAllocated = 0;
    expect(handleBudgetSubmitErrors(newBudget, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("submit error handler for update budget form", () => {
  let setter: Mock;

  let editBudget: BudgetEditInterface;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    editBudget = {
      title: "test budget",
      addedMoney: 100,
      operation: "add",
    };
  });

  it("should call setter once and return true when all update budget data is valid", () => {
    expect(handleUpdateBudgetSubmitErrors(editBudget, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(1);
  });

  it("should call setter once and return false when budget title data is invalid", () => {
    editBudget.title = "new *_bud57get   ";
    expect(handleUpdateBudgetSubmitErrors(editBudget, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
