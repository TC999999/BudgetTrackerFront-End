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
  handleUserInfoInputErrors,
  handleUserInfoSubmitErrors,
} from "./handleUserInfoErrors";
import { ConfirmUserInfo } from "../../interfaces/authInterfaces";

describe("confirm user info input error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once when there's a change in username input", () => {
    handleUserInfoInputErrors("username", "testuser", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once when there's a change in email input", () => {
    handleUserInfoInputErrors("email", "testemail@fakeemail.com", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("confirm user info submit error handler", () => {
  let setter: Mock;
  let userInfo: ConfirmUserInfo;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    userInfo = {
      username: "testuser",
      email: "testemail@fakeemail.com",
    };
  });

  it("should call setter twice and return true when all user information is valid", () => {
    expect(handleUserInfoSubmitErrors(userInfo, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when username input is invalid", () => {
    userInfo.username = " test)>+user   ";
    expect(handleUserInfoSubmitErrors(userInfo, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when email input is invalid", () => {
    userInfo.email = "invalidaddress";
    expect(handleUserInfoSubmitErrors(userInfo, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
