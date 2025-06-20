import { describe, it, expect } from "vitest";
import { getNewBudgetValue } from "./showBudgetValue";

describe("Budget Value Calculator Helper Function", () => {
  it("should calculate the correct new value of the budget based on values and operation type without any trailing numbers behind the decimal point", () => {
    expect(getNewBudgetValue(500, 66, "subtract")).toEqual(434);
    expect(getNewBudgetValue(0.1, 0.2, "add")).toEqual(0.3);
    expect(getNewBudgetValue(400.99, 200.1, "subtract")).toEqual(200.89);
    expect(getNewBudgetValue(4567, 223, "add")).toEqual(4790);
  });
});
