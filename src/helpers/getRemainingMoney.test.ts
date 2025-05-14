import { it, expect, describe } from "vitest";
import { getRemainingMoney } from "./getRemainingMoney";

describe("calculate remaining money function", () => {
  it("should calculate the correct amount of money remaining with no trailing numbers", () => {
    expect(getRemainingMoney(500, 100)).toEqual(400);
    expect(getRemainingMoney(500.1, 100.2)).toEqual(399.9);
    expect(getRemainingMoney(500.99, 100.21)).toEqual(400.78);
    expect(getRemainingMoney(500.5, 100.5)).toEqual(400);
  });
});
