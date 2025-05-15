import { describe, expect, it, beforeAll } from "vitest";
import { makeDateString, makeDateStringIncomeCard } from "./makeDateString";

describe("helper functions to make readable date strings", () => {
  let dateString1: string;
  let dateString2: string;
  let dateString3: string;

  beforeAll(() => {
    dateString1 = "2025-05-14T18:50:00.000Z";
    dateString2 = "1999-09-23T04:40:00.000Z";
    dateString3 = "2020-03-01T12:00:00.000Z";
  });

  it("should make an object consisting of date and time when a normal date string is inputted", () => {
    expect(makeDateString(dateString1)).toStrictEqual({
      date: "May 14, 2025",
      time: "02:50 PM",
    });
    expect(makeDateString(dateString2)).toStrictEqual({
      date: "Sep 23, 1999",
      time: "12:40 AM",
    });

    expect(makeDateString(dateString3)).toStrictEqual({
      date: "Mar 1, 2020",
      time: "07:00 AM",
    });
  });

  it("should make a string with date and time when a date string is inputted", () => {
    expect(makeDateStringIncomeCard(dateString1)).toBe(
      "May 14, 2025 at 02:50 PM"
    );

    expect(makeDateStringIncomeCard(dateString2)).toBe(
      "Sep 23, 1999 at 12:40 AM"
    );

    expect(makeDateStringIncomeCard(dateString3)).toBe(
      "Mar 1, 2020 at 07:00 AM"
    );
  });
});
