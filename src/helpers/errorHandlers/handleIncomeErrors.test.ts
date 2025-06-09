import { describe, it, expect, beforeAll, vi, Mock } from "vitest";
import {
  handleIncomeInputErrors,
  handleIncomeSubmitErrors,
} from "./handleIncomeErrors";
import { NewIncome } from "../../interfaces/incomeInterfaces";

describe("income input error handler", () => {
  let setter1: Mock;
  let setter2: Mock;
  let falseSetter: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
    falseSetter = vi.fn();
  });

  it("should call setter once when typing between name and value match for income title input", () => {
    handleIncomeInputErrors("title", "test income", setter1);
    expect(setter1).toHaveBeenCalledOnce();
  });

  it("should not call setter when typing between name and value don't match for income title input", () => {
    handleIncomeInputErrors("title", 100, falseSetter);
    expect(falseSetter).not.toHaveBeenCalled();
  });

  it("should call setter once when typing between name and value match for income title input", () => {
    handleIncomeInputErrors("salary", 100, setter2);
    expect(setter2).toHaveBeenCalledOnce();
  });

  it("should not call setter when typing between name and value don't match for income title input", () => {
    handleIncomeInputErrors("salary", "NAN", falseSetter);
    expect(falseSetter).not.toHaveBeenCalled();
  });
});

describe("income submit error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter twice and return true for income with correct data", () => {
    let newIncome: NewIncome = {
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

    expect(handleIncomeSubmitErrors(newIncome, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should return false for income with bad title data", () => {
    let newIncome: NewIncome = {
      title: " test() income",
      salary: 1000,
      updateTime: {
        minute: "30",
        hour: "12",
        month: "1",
        dayOfMonth: "15",
        dayOfWeek: "*",
      },
    };
    expect(handleIncomeSubmitErrors(newIncome, setter)).toBe(false);
  });

  it("should return false for income with bad salary value data", () => {
    let newIncome: NewIncome = {
      title: "test income",
      salary: 0,
      updateTime: {
        minute: "30",
        hour: "12",
        month: "1",
        dayOfMonth: "15",
        dayOfWeek: "*",
      },
    };
    expect(handleIncomeSubmitErrors(newIncome, setter)).toBe(false);
  });
});
