import { describe, expect, it } from "vitest";
import { makeTimeString } from "./makeTimeString";

describe("helper function to make readable time string to for creating a new income", () => {
  it("should return the correct time string", () => {
    expect(makeTimeString("12", "56")).toBe("12:56 p.m.");
    expect(makeTimeString("16", "37")).toBe("04:37 p.m.");
    expect(makeTimeString("19", "2")).toBe("07:02 p.m.");
    expect(makeTimeString("21", "20")).toBe("09:20 p.m.");

    expect(makeTimeString("1", "49")).toBe("01:49 a.m.");
    expect(makeTimeString("6", "31")).toBe("06:31 a.m.");
    expect(makeTimeString("9", "9")).toBe("09:09 a.m.");
    expect(makeTimeString("11", "30")).toBe("11:30 a.m.");

    expect(makeTimeString("12", "0")).toBe("Noon");
    expect(makeTimeString("0", "0")).toBe("Midnight");
  });
});
