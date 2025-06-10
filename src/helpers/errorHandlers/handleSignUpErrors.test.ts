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
  handleSignUpInputErrors,
  handleSignUpSubmitErrors,
} from "./handleSignUpErrors";
import { SignUpSensitive } from "../../interfaces/authInterfaces";

describe("sign up input error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once for username input", () => {
    handleSignUpInputErrors("username", "testuser", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once for username input", () => {
    handleSignUpInputErrors("password", "testpassword", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once for username input", () => {
    handleSignUpInputErrors("email", "testemail@fakeaddress.com", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once for username input", () => {
    handleSignUpInputErrors(
      "confirmPassword",
      "testpassword",
      setter,
      "testpassword"
    );
    expect(setter).toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("sign up submit error handler", () => {
  let setter: Mock;

  let signUpInfo: SignUpSensitive;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    signUpInfo = {
      username: "testuser",
      password: "brandnewpassword123",
      email: "testemail@fakeemail.com",
      confirmPassword: "brandnewpassword123",
    };
  });

  it("should call setter four times and return true if all sign up data is valid", () => {
    expect(handleSignUpSubmitErrors(signUpInfo, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(4);
  });

  it("should call setter four times and return false if username data is invalid", () => {
    signUpInfo.username = " testuser*()|   ";
    expect(handleSignUpSubmitErrors(signUpInfo, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(4);
  });

  it("should call setter four times and return false if password data is invalid", () => {
    signUpInfo.password = "tooshort123";
    signUpInfo.confirmPassword = "tooshort123";
    expect(handleSignUpSubmitErrors(signUpInfo, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(4);
  });

  it("should call setter four times and return false if email data is invalid", () => {
    signUpInfo.email = "invalidEmail";
    expect(handleSignUpSubmitErrors(signUpInfo, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(4);
  });

  it("should call setter four times and return false if confirm password data doesn't match new password data", () => {
    signUpInfo.confirmPassword = "brandnewpassword456";
    expect(handleSignUpSubmitErrors(signUpInfo, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(4);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
