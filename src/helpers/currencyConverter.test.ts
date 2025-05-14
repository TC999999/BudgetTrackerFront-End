import { it, expect, describe } from "vitest";
import {
  currencyConverter,
  numPop,
  dollarConverter,
} from "./currencyConverter";

describe("currency converter function", () => {
  it("should push the new num to the end of the original num and convert to a currency decimal", () => {
    expect(currencyConverter(0, 8)).toEqual(0.08);
    expect(currencyConverter(500, 8)).toEqual(5000.08);
    expect(currencyConverter(99.99, 1)).toEqual(999.91);
  });
});

describe("numPop function", () => {
  it("should pop the last digit of the inputted number and convert it to proper decimal form", () => {
    expect(numPop(1500)).toEqual(150);
    expect(numPop(500.55)).toEqual(50.05);
    expect(numPop(99.99)).toEqual(9.99);
  });
});

describe("dollar converter function", () => {
  it("should convert a number to currency form", () => {
    expect(dollarConverter(50)).toBe("$50.00");
    expect(dollarConverter(50.8)).toBe("$50.80");
    expect(dollarConverter(50.89)).toBe("$50.89");
  });
});
