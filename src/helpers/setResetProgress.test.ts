import { describe, it, expect } from "vitest";
import { setRegisterProgress, setResetProgress } from "./setResetProgress";

describe("Multipart Form Progress Number Helper Functions", () => {
  it("should return correct numbers based on inputted step in setResetProgress", () => {
    expect(setResetProgress("userInfo")).toEqual(25);
    expect(setResetProgress("oneTimeCode")).toEqual(50);
    expect(setResetProgress("newPassword")).toEqual(75);
    expect(setResetProgress("success")).toEqual(100);
  });

  it("should return correct numbers based on inputted step in setRegisterProgress", () => {
    expect(setRegisterProgress("showSensitiveForm")).toEqual(33);
    expect(setRegisterProgress("showOTPForm")).toEqual(66);
    expect(setRegisterProgress("showAdditionalForm")).toEqual(99);
  });
});
