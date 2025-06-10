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
import {
  handleExpenseInputErrors,
  handleExpenseSubmitErrors,
} from "./handleExpenseErrors";
import { newExpenseInterface } from "../../interfaces/expenseInterfaces";

describe("input handler for new expense", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call the setter once for a single handle of a title input", () => {
    handleExpenseInputErrors("title", "test expense", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call the setter once for a single handle of a transaction value input", () => {
    handleExpenseInputErrors("transaction", 100, setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call the setter once for a single handle of a date input", () => {
    handleExpenseInputErrors("date", "01-01-2025", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter if typing between name and value for title is mismatched", () => {
    handleExpenseInputErrors("title", 100, setter);
    expect(setter).not.toHaveBeenCalled();
  });

  it("should not call setter if typing between name and value for transaction is mismatched", () => {
    handleExpenseInputErrors("transaction", "NAN", setter);
    expect(setter).not.toHaveBeenCalled();
  });

  it("should not call setter if typing between name and value for date is mismatched", () => {
    handleExpenseInputErrors("date", 100, setter);
    expect(setter).not.toHaveBeenCalled();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("submit handler for new expense", () => {
  let setter: Mock;
  let newExpense: newExpenseInterface;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    newExpense = {
      title: "new expense",
      transaction: 1000,
      date: "01-01-2025",
    };
  });

  it("should call the setter three times and return true when all new expense data is valid", () => {
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false when new expense data contains title error", () => {
    newExpense.title = " new exp(*+ense   ";
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false when new expense data contains transaction error", () => {
    newExpense.transaction = 0;
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false when new expense data contains date error", () => {
    newExpense.date = "";
    expect(handleExpenseSubmitErrors(newExpense, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
