import { describe, it, expect, beforeAll } from "vitest";
import { makeReadableUpdateTimeString } from "./makeReadableUpdateTimeString";
import { UpdateTime } from "../interfaces/incomeInterfaces";

describe("helper function to make a readable update time string letting users know when their savings will increase by a set amount", () => {
  let ut1: UpdateTime;
  let ut2: UpdateTime;
  let ut3: UpdateTime;
  let ut4: UpdateTime;

  beforeAll(() => {
    ut1 = {
      minute: "50",
      hour: "13",
      dayOfMonth: "23",
      month: "*",
      dayOfWeek: "*",
    };

    ut2 = {
      minute: "0",
      hour: "12",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "3",
    };

    ut3 = {
      minute: "0",
      hour: "0",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "5",
    };

    ut4 = {
      minute: "30",
      hour: "9",
      dayOfMonth: "13",
      month: "2",
      dayOfWeek: "*",
    };
  });

  it("should make the correct string for inputted update time", () => {
    expect(makeReadableUpdateTimeString(ut1)).toBe(
      "01:50 p.m. on the 23rd day of every month"
    );
    expect(makeReadableUpdateTimeString(ut2)).toBe("Noon on every Wednesday");
    expect(makeReadableUpdateTimeString(ut3)).toBe("Midnight on every Friday");
    expect(makeReadableUpdateTimeString(ut4)).toBe(
      "09:30 a.m. on the 13th day of February every year"
    );
  });
});
