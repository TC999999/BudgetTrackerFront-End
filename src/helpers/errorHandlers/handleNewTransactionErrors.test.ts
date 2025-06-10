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
  handleSubtractErrors,
  handleAddErrors,
  handleUserComparisons,
  handleUserEditInputErrors,
  handleEditUserSubmitErrors,
} from "./handleNewTransactionErrors";
import { NewTransaction } from "../../interfaces/transactionInterfaces";

describe("new transaction subtraction error handler", () => {
  it("should return correct error string if assets being subtracted is greater than the user's total assets", () => {
    expect(handleSubtractErrors(500, 100)).toBe(
      "Cannot subtract a value greater than current total assets"
    );
  });

  it("should return empty string if assets being subtracted is less than the user's total assets", () => {
    expect(handleSubtractErrors(100, 500)).toBe("");
  });

  it("should return empty string if assets being subtracted is equal to the user's total assets", () => {
    expect(handleSubtractErrors(500, 500)).toBe("");
  });
});

describe("new transaction add error handler", () => {
  it("should return correct error string if assets being added is greater than the given maximum value", () => {
    expect(handleAddErrors(500, 100)).toBe(
      "You've reached the maximum asset value."
    );
  });

  it("should return empty string if assets being added is less than the given maximum value", () => {
    expect(handleAddErrors(100, 500)).toBe("");
  });

  it("should return empty string if assets being subtracted is equal the given maximum value", () => {
    expect(handleAddErrors(500, 500)).toBe("");
  });
});

describe("new transaction comparison error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once and return false when new assets are less than total assets and uses a subtract operation", () => {
    expect(handleUserComparisons(50, setter, "subtract", 9999, 500)).toBe(
      false
    );
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should return true when new assets exceed total assets and uses a subtract operation", () => {
    expect(handleUserComparisons(5000, setter, "subtract", 9999, 500)).toBe(
      true
    );
  });

  it("should call setter once and return false when new assets are less than the given max value and uses an add operation", () => {
    expect(handleUserComparisons(600, setter, "add", 9999, 500)).toBe(false);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should return true when new assets exceed the given max value and uses an add operation", () => {
    expect(handleUserComparisons(10000, setter, "add", 9999, 500)).toBe(true);
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("new transaction input error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once for title input when input is a string", () => {
    handleUserEditInputErrors("title", "test transaction", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter for title input when input is not a string", () => {
    handleUserEditInputErrors("title", 500, setter);
    expect(setter).not.toHaveBeenCalled();
  });

  it("should call setter once for value input when input is a number", () => {
    handleUserEditInputErrors("value", 500, setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter for value input when input is not a number", () => {
    handleUserEditInputErrors("value", "NAN", setter);
    expect(setter).not.toHaveBeenCalled();
  });

  it("should call setter once for date input when input is a string", () => {
    handleUserEditInputErrors("date", "01-01-2025", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter for date input when input is not a string", () => {
    handleUserEditInputErrors("date", 500, setter);
    expect(setter).not.toHaveBeenCalled();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("new transaction form submit error handler", () => {
  let setter: Mock;
  let newTransaction: NewTransaction;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    newTransaction = {
      title: "test transaction",
      value: 500,
      operation: "add",
      date: "01-01-2025",
    };
  });

  it("should call setter three times and return true when all new transaction information is valid", () => {
    expect(handleEditUserSubmitErrors(newTransaction, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false if title input contains errors", () => {
    newTransaction.title = " t^est tr()an+saction  ";
    expect(handleEditUserSubmitErrors(newTransaction, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false if value input contains errors", () => {
    newTransaction.value = 0;
    expect(handleEditUserSubmitErrors(newTransaction, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false if date input contains errors", () => {
    newTransaction.date = "";
    expect(handleEditUserSubmitErrors(newTransaction, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
