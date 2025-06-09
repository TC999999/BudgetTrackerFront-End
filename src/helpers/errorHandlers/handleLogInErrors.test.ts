import { describe, it, expect, beforeAll, vi, Mock } from "vitest";
import {
  handleLogInInputErrors,
  handleLogInSubmitErrors,
} from "./handleLogInErrors";
import { LogInInterface } from "../../interfaces/authInterfaces";

describe("login input error handler", () => {
  let setter1: Mock;
  let setter2: Mock;

  beforeAll(() => {
    setter1 = vi.fn();
    setter2 = vi.fn();
  });

  it("should call setter once for username input", () => {
    handleLogInInputErrors("username", "testusername", setter1);
    expect(setter1).toHaveBeenCalledOnce();
  });

  it("should call setter once for password input", () => {
    handleLogInInputErrors("password", "testpassword123", setter2);
    expect(setter2).toHaveBeenCalledOnce();
  });
});

describe("login submit error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter twice and return true when no errors occur", () => {
    let login: LogInInterface = {
      username: "testusername",
      password: "testpassword123",
      trusted: true,
    };
    expect(handleLogInSubmitErrors(login, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(2);
  });

  it("return false when inputs are empty", () => {
    let login: LogInInterface = {
      username: "",
      password: "",
      trusted: true,
    };
    expect(handleLogInSubmitErrors(login, setter)).toBe(false);
  });
});
