import { expect, describe, it, beforeAll } from "vitest";
import { makeCronString } from "./makeCronString";
import { UpdateTime } from "../interfaces/incomeInterfaces";

describe("Cron String Construction Helper Function", () => {
  let ut1: UpdateTime;
  let ut2: UpdateTime;
  let ut3: UpdateTime;

  beforeAll(() => {
    ut1 = {
      minute: "0",
      hour: "0",
      dayOfMonth: "1",
      month: "1",
      dayOfWeek: "*",
    };

    ut2 = {
      minute: "30",
      hour: "12",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "2",
    };

    ut3 = {
      minute: "45",
      hour: "20",
      dayOfMonth: "17",
      month: "*",
      dayOfWeek: "*",
    };
  });

  it("should successfully create a cron string from an object", () => {
    expect(makeCronString(ut1)).toBe("0 0 1 1 *");
    expect(makeCronString(ut2)).toBe("30 12 * * 2");
    expect(makeCronString(ut3)).toBe("45 20 17 * *");
  });
});
