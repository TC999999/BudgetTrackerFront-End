import {
  calcNewMoneyRemaining,
  calcNewMoneySpent,
} from "./calculateExpenseDelete";
import { describe, it, expect } from "vitest";

describe("Calculate New Money Spent/Remaining Helper Functions", () => {
  it("should calculate the new value for the remaining money", () => {
    expect(calcNewMoneyRemaining(5000, 2500)).toBe(7500);
  });

  it("should calculate the new value for the money spent", () => {
    expect(calcNewMoneySpent(5000, 2500)).toBe(2500);
  });
});
