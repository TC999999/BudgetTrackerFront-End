import {
  calculateNewTotalAssets,
  calculateNewTotalAssetsUserDashboard,
  calculateNewTotalAssetsWithoutOperation,
} from "./calculateNewTotalAssets";
import { describe, it, expect } from "vitest";

describe("helper function for calculating the new total savings value for a single user after adding/updating a budget", () => {
  it("subtract from the user's savings after adding/updating a budget (the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssets(5000, 250000, "add")).toBe("2500.00");
  });

  it("adds to the user's savings after updating a budget (the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssets(5000, 250000, "subtract")).toBe("7500.00");
  });
});

describe("helper function for calculating the new total savings value for a single user after adding a transaction", () => {
  it("adds to the user's savings after the user makes a add transaction (the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssetsUserDashboard(5000, 250000, "add")).toBe(
      "7500.00"
    );
  });

  it("subtracts from the user's savings after the user makes a subtract transaction(the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssetsUserDashboard(5000, 250000, "subtract")).toBe(
      "2500.00"
    );
  });
});

describe("helper function for calculating the new total savings value for a single user after deleting a budget", () => {
  it("adds to the user's savings after the user deletes a budget", () => {
    expect(calculateNewTotalAssetsWithoutOperation(5000, 2500)).toBe("7500.00");
  });
});
