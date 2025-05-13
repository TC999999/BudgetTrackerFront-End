import {
  returnUsernameErrors,
  returnPasswordErrors,
  returnEmptyInputErrors,
  returnConfirmPasswordErrors,
  returnEmailErrors,
  returnTitleErrors,
  returnValueErrors,
  returnDateErrors,
} from "./commonHandlers";
import { describe, it, expect } from "vitest";

describe("common username error handlers return either strings describing errors or empty strings", () => {
  it("returns correct string when username is too long", () => {
    expect(returnUsernameErrors("thisusernameiswaytoolongtobeused")).toBe(
      "Username must be less than 30 characters."
    );
  });

  it("returns correct string when username is too short", () => {
    expect(returnUsernameErrors("short")).toBe(
      "Username must be more than 6 characters."
    );
  });

  it("returns correct string when username contains invalid characters", () => {
    expect(returnUsernameErrors("$too^many&bad*characters%")).toBe(
      "Username input contains invalid characters."
    );
  });

  it("returns correct string when username is empty", () => {
    expect(returnUsernameErrors("")).toBe("Username input cannot be empty.");
  });

  it("returns empty string when username passes validators", () => {
    expect(returnUsernameErrors("perfectUsername123")).toBe("");
  });
});

describe("common password error handlers return either strings describing errors or empty strings", () => {
  it("returns correct string when password is too long", () => {
    expect(returnPasswordErrors("passwordIsWayTooLong1234")).toBe(
      "Password length must be less than 20 characters."
    );
  });

  it("returns correct string when password is too short", () => {
    expect(returnPasswordErrors("shortPassword12")).toBe(
      "Password length must be greater than 16 characters."
    );
  });

  it("returns correct string when password contains invalid characters", () => {
    expect(returnPasswordErrors("@too(many)bad[char]")).toBe(
      "Password input contains invalid characters."
    );
  });

  it("returns correct string when password is empty", () => {
    expect(returnPasswordErrors("")).toBe("Password input cannot be empty.");
  });

  it("returns empty string when username passes all validators", () => {
    expect(returnPasswordErrors("perfectPassword123!!")).toBe("");
  });
});

describe("common empty input error handlers return either string describing error or empty strings", () => {
  it("returns correct string when username is empty", () => {
    expect(returnEmptyInputErrors("", "Username")).toBe(
      "Username input cannot be empty."
    );
  });

  it("returns empty string when username passes validators", () => {
    expect(returnEmptyInputErrors("perfectUsername123", "Username")).toBe("");
  });

  it("returns correct string when password is empty", () => {
    expect(returnEmptyInputErrors("", "Password")).toBe(
      "Password input cannot be empty."
    );
  });

  it("returns empty string when username passes all validators", () => {
    expect(returnEmptyInputErrors("perfectPassword123!!", "Password")).toBe("");
  });
});

describe("common password confirmation error handlers return either string describing error or empty strings", () => {
  it("returns correct string if confirm password input is empty", () => {
    expect(returnConfirmPasswordErrors("perfectPassword123", "")).toBe(
      "Password confirmation input cannot be empty."
    );
  });

  it("returns correct string if confirm password input doesn't match password input", () => {
    expect(
      returnConfirmPasswordErrors("perfectPassword123", "incorrectPassword12")
    ).toBe("Does not match password above!");
  });

  it("returns empty string if confirm password input matches password input", () => {
    expect(
      returnConfirmPasswordErrors("perfectPassword123", "perfectPassword123")
    ).toBe("");
  });
});

describe("common email error handlers return either string describing error or empty strings", () => {
  it("returns correct string if email input is empty", () => {
    expect(returnEmailErrors("")).toBe("Email address input cannot be empty.");
  });

  it("returns correct string if email input is invalid", () => {
    expect(returnEmailErrors("invalidEmailAddress")).toBe(
      "Email address is invalid."
    );
  });

  it("returns empty string if email address input passes all validators", () => {
    expect(returnEmailErrors("validEmailAddress@gmail.com")).toBe("");
  });
});

describe("common title (budget/expense/income/transaction) error handlers return either string describing error or empty strings", () => {
  it("returns correct string if budget title input is empty", () => {
    expect(returnTitleErrors("", "Budget")).toBe(
      "Budget title input cannot be empty."
    );
  });

  it("returns correct string if expense title input is empty", () => {
    expect(returnTitleErrors("", "Expense")).toBe(
      "Expense title input cannot be empty."
    );
  });

  it("returns correct string if transaction title input contains invalid characters", () => {
    expect(returnTitleErrors("test title&*^", "Transaction")).toBe(
      "Transaction title input contains invalid characters."
    );
  });

  it("returns correct string if income title input contains invalid characters", () => {
    expect(returnTitleErrors("test title&*^", "Income")).toBe(
      "Income title input contains invalid characters."
    );
  });

  it("returns correct string if expense title input has untrimmed spaces", () => {
    expect(returnTitleErrors(" test title", "Expense")).toBe(
      "Expense title input cannot have spaces at beginning or end."
    );
  });

  it("returns correct string if income title input has untrimmed spaces", () => {
    expect(returnTitleErrors("test title ", "Income")).toBe(
      "Income title input cannot have spaces at beginning or end."
    );
  });

  it("returns correct string if budget title input has less than three characters", () => {
    expect(returnTitleErrors("te", "Budget")).toBe(
      "Budget title must be greater than 3 characters."
    );
  });

  it("returns correct string if transaction title input has less than three characters", () => {
    expect(returnTitleErrors("te", "Transaction")).toBe(
      "Transaction title must be greater than 3 characters."
    );
  });

  it("returns correct string if expense title input has more than twenty characters", () => {
    expect(returnTitleErrors("test test test test test", "Expense")).toBe(
      "Expense title must be less than 20 characters."
    );
  });

  it("returns correct string if budget title input has more than twenty characters", () => {
    expect(returnTitleErrors("test test test test test", "Budget")).toBe(
      "Budget title must be less than 20 characters."
    );
  });

  it("returns empty string if transaction title passes all validators", () => {
    expect(returnTitleErrors("title: user's test", "Transaction")).toBe("");
  });

  it("returns empty string if income title passes all validators", () => {
    expect(returnTitleErrors("title: user's test", "Income")).toBe("");
  });
});

describe("common value error handlers return either string describing error or empty strings", () => {
  it("returns correct string if income value is zero", () => {
    expect(returnValueErrors(0, "Income")).toBe(
      "Income value must be greater than $0.00."
    );
  });

  it("returns correct string if budget value is zero", () => {
    expect(returnValueErrors(0, "Budget")).toBe(
      "Budget value must be greater than $0.00."
    );
  });

  it("returns empty string if transaction value is greater than zero", () => {
    expect(returnValueErrors(50, "Transaction")).toBe("");
  });

  it("returns empty string if expense value is greater than zero", () => {
    expect(returnValueErrors(100, "Expense")).toBe("");
  });
});

describe("common date error handlers return either string describing error or empty strings", () => {
  it("returns correct string if expense date input is empty", () => {
    expect(returnDateErrors("", "Expense")).toBe("Expense Date is Required.");
  });

  it("returns correct string if transaction date input is empty", () => {
    expect(returnDateErrors("", "Transaction")).toBe(
      "Transaction Date is Required."
    );
  });

  it("returns empty string if budget date input is not empty", () => {
    expect(returnDateErrors("2025-01-01T00:00", "Budget")).toBe("");
  });

  it("returns empty string if income date input is not empty", () => {
    expect(returnDateErrors("2025-01-01T00:00", "Income")).toBe("");
  });
});
