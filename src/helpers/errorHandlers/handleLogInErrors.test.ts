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
  handleLogInInputErrors,
  handleLogInSubmitErrors,
} from "./handleLogInErrors";
import { LogInInterface } from "../../interfaces/authInterfaces";

describe("login input error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once for username input", () => {
    handleLogInInputErrors("username", "testusername", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once for password input", () => {
    handleLogInInputErrors("password", "testpassword123", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("login submit error handler", () => {
  let setter: Mock;
  let login: LogInInterface;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    login = {
      username: "testusername",
      password: "testpassword123",
      trusted: true,
    };
  });

  it("should call setter twice and return true all login data is valid", () => {
    expect(handleLogInSubmitErrors(login, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("should call setter twice and return false when login input values are empty", () => {
    login.username = "";
    login.password = "";
    expect(handleLogInSubmitErrors(login, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
