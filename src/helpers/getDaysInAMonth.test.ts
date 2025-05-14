import { it, expect, describe } from "vitest";
import { getDaysInAMonth } from "./getDaysInAMonth";

describe("get days in month map function", () => {
  it("should get correct map of days for respective month number for months with 31 days", () => {
    expect(getDaysInAMonth("1").get("31")).toBe("31");
    expect(getDaysInAMonth("1").get("30")).toBe("30");
    expect(getDaysInAMonth("3").get("31")).toBe("31");
    expect(getDaysInAMonth("3").get("1")).toBe("1");
    expect(getDaysInAMonth("5").get("31")).toBe("31");
  });

  it("should get correct map of days for respective month number for months with 30 days", () => {
    expect(getDaysInAMonth("4").get("30")).toBe("30");
    expect(getDaysInAMonth("4").get("31")).toBe(undefined);
    expect(getDaysInAMonth("6").get("30")).toBe("30");
    expect(getDaysInAMonth("6").get("1")).toBe("1");
    expect(getDaysInAMonth("9").get("30")).toBe("30");
  });
  it("should get correct map of days for respective month number for months with 29 days", () => {
    expect(getDaysInAMonth("2").get("31")).toBe(undefined);
    expect(getDaysInAMonth("2").get("30")).toBe(undefined);
    expect(getDaysInAMonth("2").get("29")).toBe("29");
    expect(getDaysInAMonth("2").get("28")).toBe("28");
    expect(getDaysInAMonth("2").get("1")).toBe("1");
  });
});
