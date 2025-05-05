import { constructUpdateTimeObj } from "./constructUpdateTimeObj";
import { describe, it, expect } from "vitest";

describe("constructs an object from a cron string for initial state in an income update form", () => {
  it("should create an object from a cron string", () => {
    let cronString = "23 4 21 5 *";
    expect(constructUpdateTimeObj(cronString)).toStrictEqual({
      minute: "23",
      hour: "4",
      dayOfMonth: "21",
      month: "5",
      dayOfWeek: "*",
    });

    let cronString2 = "15 12 * 7 2";
    expect(constructUpdateTimeObj(cronString2)).toStrictEqual({
      minute: "15",
      hour: "12",
      dayOfMonth: "*",
      month: "7",
      dayOfWeek: "2",
    });
  });
});
