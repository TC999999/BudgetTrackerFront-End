import { describe, it, expect } from "vitest";
import { makeEndString, makeDayMonthString } from "./makeDayMonthString";

describe("helper functions to make string consisting of a day and a month as well as other strings when a cron number inputted", () => {
  it("should return the correct end string when proper cron markers are inputted", () => {
    expect(makeEndString("12", "*")).toBe("");
    expect(makeEndString("*", "21")).toBe("");
    expect(makeEndString("12", "21")).toBe(" every year");
    expect(makeEndString("*", "*")).toBe("");
  });

  it("should return the correct day month string when proper cron markers are inputted", () => {
    expect(makeDayMonthString("12", "*", "*")).toBe(
      " on every day of December"
    );
    expect(makeDayMonthString("12", "14", "*")).toBe(
      " on the 14th day of December every year"
    );
    expect(makeDayMonthString("*", "*", "*")).toBe(" on every day of the year");
    expect(makeDayMonthString("*", "*", "1")).toBe("");
  });
});
