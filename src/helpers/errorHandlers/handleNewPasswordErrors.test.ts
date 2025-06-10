import {
  describe,
  it,
  expect,
  beforeAll,
  vi,
  Mock,
  afterEach,
  beforeEach,
} from "vitest";
import {
  handleConfirmPasswordInputErrors,
  handleConfirmPasswordSubmitErrors,
} from "./handleNewPasswordErrors";
import { PasswordResetInfo } from "../../interfaces/authInterfaces";

describe("new password input error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once for new password input", () => {
    handleConfirmPasswordInputErrors("newPassword", "newPassword123", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once for confirm new password input", () => {
    handleConfirmPasswordInputErrors(
      "confirmNewPassword",
      "newPassword123",
      setter
    );
    expect(setter).toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("new password submit error handler", () => {
  let setter: Mock;
  let newPassword: PasswordResetInfo;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    newPassword = {
      newPassword: "brandNewPassword123",
      confirmNewPassword: "brandNewPassword123",
    };
  });

  it("should call setter twice and return true when all new password data is valid", () => {
    expect(handleConfirmPasswordSubmitErrors(newPassword, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when new password input is empty", () => {
    newPassword.newPassword = "";
    newPassword.confirmNewPassword = "";
    expect(handleConfirmPasswordSubmitErrors(newPassword, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when confirm new password input is empty", () => {
    newPassword.confirmNewPassword = "";
    expect(handleConfirmPasswordSubmitErrors(newPassword, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when new password and confirm password don't match", () => {
    newPassword.confirmNewPassword = "brandNewPassword124";
    expect(handleConfirmPasswordSubmitErrors(newPassword, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
