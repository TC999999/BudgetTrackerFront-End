import {
  calculateNewTotalAssets,
  calculateNewTotalAssetsUserDashboard,
  calculateNewTotalAssetsWithoutOperation,
} from "./calculateNewTotalAssets";
import { describe, it, expect } from "vitest";

describe("Calculating New Total Savings for Budget Add Helper Function", () => {
  it("subtract from the user's savings after adding/updating a budget (the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssets(5000, 2500, "add")).toBe(2500);
  });

  it("adds to the user's savings after updating a budget (the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssets(5000, 2500, "subtract")).toBe(7500);
  });
});

describe("Calculating New Total Savings for Transaction Helper Function", () => {
  it("adds to the user's savings after the user makes a add transaction (the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssetsUserDashboard(5000, 2500, "add")).toBe(7500);
  });

  it("subtracts from the user's savings after the user makes a subtract transaction(the first value is converted to currency form without decimal)", () => {
    expect(calculateNewTotalAssetsUserDashboard(5000, 2500, "subtract")).toBe(
      2500
    );
  });
});

describe("Calculating New Total Savings for Budget Delete Helper Function", () => {
  it("adds to the user's savings after the user deletes a budget", () => {
    expect(calculateNewTotalAssetsWithoutOperation(5000, 2500)).toBe(7500);
  });
});
