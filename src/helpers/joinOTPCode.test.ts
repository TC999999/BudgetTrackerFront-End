import { describe, it, expect, beforeAll } from "vitest";
import { joinOTPCode } from "./joinOTPCode";
import { OneTimeCodeFormData } from "../interfaces/authInterfaces";

describe("Joins 6-Digit Code Helper Function", () => {
  let code1: OneTimeCodeFormData;
  let code2: OneTimeCodeFormData;
  let code3: OneTimeCodeFormData;
  beforeAll(() => {
    code1 = {
      0: "5",
      1: "2",
      2: "4",
      3: "8",
      4: "0",
      5: "9",
    };

    code2 = {
      0: "6",
      1: "6",
      2: "3",
      3: "1",
      4: "8",
      5: "3",
    };

    code3 = {
      0: "3",
      1: "3",
      2: "3",
      3: "3",
      4: "3",
      5: "3",
    };
  });

  it("should join numbers in object correctly", () => {
    expect(joinOTPCode(code1)).toBe("524809");
    expect(joinOTPCode(code2)).toBe("663183");
    expect(joinOTPCode(code3)).toBe("333333");
  });
});
