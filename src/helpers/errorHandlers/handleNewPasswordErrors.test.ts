import { describe, it, expect, beforeAll, vi, Mock } from "vitest";
import {
  handleConfirmPasswordInputErrors,
  handleConfirmPasswordSubmitErrors,
} from "./handleNewPasswordErrors";
import { PasswordResetInfo } from "../../interfaces/authInterfaces";

describe("new password input error handler", () => {
  let setter1: Mock;
  let setter2: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
  });

  it("should call setter once for new password input", () => {
    handleConfirmPasswordInputErrors("newPassword", "newPassword123", setter1);
    expect(setter1).toHaveBeenCalledOnce();
  });

  it("should call setter once for confirm new password input", () => {
    handleConfirmPasswordInputErrors(
      "confirmNewPassword",
      "newPassword123",
      setter2
    );
    expect(setter2).toHaveBeenCalledOnce();
  });
});

describe("new password submit error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter twice and return true when new password data has no errors", () => {
    let newPassword: PasswordResetInfo = {
      newPassword: "brandNewPassword123",
      confirmNewPassword: "brandNewPassword123",
    };
    expect(handleConfirmPasswordSubmitErrors(newPassword, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("return false when new password data has errors", () => {
    let newPassword: PasswordResetInfo = {
      newPassword: "brandNewPassword123",
      confirmNewPassword: "brandNewPassword124",
    };
    expect(handleConfirmPasswordSubmitErrors(newPassword, setter)).toBe(false);
  });
});
