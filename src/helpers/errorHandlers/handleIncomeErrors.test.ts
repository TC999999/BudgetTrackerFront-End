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
  handleIncomeInputErrors,
  handleIncomeSubmitErrors,
} from "./handleIncomeErrors";
import { NewIncome } from "../../interfaces/incomeInterfaces";

describe("income input error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once when typing between name and value match for income title input", () => {
    handleIncomeInputErrors("title", "test income", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter when typing between name and value don't match for income title input", () => {
    handleIncomeInputErrors("title", 100, setter);
    expect(setter).not.toHaveBeenCalled();
  });

  it("should call setter once when typing between name and value match for income title input", () => {
    handleIncomeInputErrors("salary", 100, setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should not call setter when typing between name and value don't match for income title input", () => {
    handleIncomeInputErrors("salary", "NAN", setter);
    expect(setter).not.toHaveBeenCalled();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("income submit error handler", () => {
  let setter: Mock;
  let newIncome: NewIncome;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    newIncome = {
      title: "test income",
      salary: 1000,
      updateTime: {
        minute: "30",
        hour: "12",
        month: "1",
        dayOfMonth: "15",
        dayOfWeek: "*",
      },
    };
  });

  it("should call setter twice and return true when new income data is valid", () => {
    expect(handleIncomeSubmitErrors(newIncome, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false for income data with invalid title", () => {
    newIncome.title = " test() income";
    expect(handleIncomeSubmitErrors(newIncome, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false for income data with invalid salary value", () => {
    newIncome.salary = 0;
    expect(handleIncomeSubmitErrors(newIncome, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
