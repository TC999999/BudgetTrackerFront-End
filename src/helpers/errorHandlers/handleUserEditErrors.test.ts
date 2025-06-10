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
  handleUserEditInputErrors,
  handleUserEditSubmitErrors,
} from "./handleUserEditErrors";
import { EditUser } from "../../interfaces/userInterfaces";

describe("user information edit input error handler", () => {
  let setter: Mock;

  beforeAll(() => {
    setter = vi.fn();
  });

  it("should call setter once when using username input", () => {
    handleUserEditInputErrors("username", "testuser", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once when using username input", () => {
    handleUserEditInputErrors("password", "testpassword123", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  it("should call setter once when using username input", () => {
    handleUserEditInputErrors("email", "testemail@fakeemail.com", setter);
    expect(setter).toHaveBeenCalledOnce();
  });

  afterEach(() => {
    setter.mockClear();
  });
});

describe("user information edit submission error handler", () => {
  let setter: Mock;
  let editedData: EditUser;

  beforeAll(() => {
    setter = vi.fn();
  });

  beforeEach(() => {
    editedData = {
      username: "newTestUser",
      password: "brandNewPassword123",
      email: "newTestEmail@fakeEmail.com",
    };
  });

  it("should call setter three times and return true when all edit data is valid", () => {
    expect(handleUserEditSubmitErrors(editedData, setter)).toBe(true);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false when username data is invalid", () => {
    editedData.username = "new^T$e=st  #user ";
    expect(handleUserEditSubmitErrors(editedData, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false when password data is empty", () => {
    editedData.password = "";
    expect(handleUserEditSubmitErrors(editedData, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  it("should call setter three times and return false when email data is invalid", () => {
    editedData.email = "invalidEmailAddress";
    expect(handleUserEditSubmitErrors(editedData, setter)).toBe(false);
    expect(setter).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    setter.mockClear();
  });
});
