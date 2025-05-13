import { handleAddErrors, handleSubtractErrors } from "./handleBudgetErrors";
import { describe, it, expect } from "vitest";

describe("add error handler returns correct string based on input and total savings value", () => {
  it("returns correct string if budget value input is greater than user's total savings", () => {
    expect(handleAddErrors(100, 50)).toBe(
      "New funds cannot be more that total savings."
    );
  });

  it("returns empty string if budget value input is less than user's total savings", () => {
    expect(handleAddErrors(10, 50)).toBe("");
  });
});

describe("subtract error handler returns correct string based on input", () => {
  it("returns correct string if value input being added to savings is greater than remaining money in budget", () => {
    expect(handleSubtractErrors(100, 50)).toBe(
      "New funds cannot be more than remaining budget funds."
    );
  });

  it("returns empty string if value input being added to savings is less than remaining money in budget", () => {
    expect(handleSubtractErrors(10, 50)).toBe("");
  });
});
