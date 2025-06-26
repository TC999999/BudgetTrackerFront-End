import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import NewPassword from "./NewPassword";
import { ConfirmUserInfo } from "../interfaces/authInterfaces";

describe("Form for Creating New Password", () => {
  let changeStep: Mock;
  let changeLoading: Mock;
  let changeSubmitError: Mock;
  let currentUser: ConfirmUserInfo;
  let mockSubmit: Mock;

  beforeAll(() => {
    changeStep = vi.fn();
    changeLoading = vi.fn();
    changeSubmitError = vi.fn();
    currentUser = { username: "testuser", email: "testemail@gmail.com" };
    mockSubmit = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );
  });

  it("should have a regular password input that users can change", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    let passwordInput = screen.getByLabelText("Input your new password here:");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toContainHTML("");
    expect(passwordInput).toHaveValue("");

    fireEvent.change(passwordInput, {
      target: { value: "brandNewPassword123" },
    });
    expect(passwordInput).toContainHTML("brandNewPassword123");
    expect(passwordInput).toHaveValue("brandNewPassword123");
    expect(passwordInput).toHaveClass("input-valid");
    expect(passwordInput).not.toHaveClass("input-error");
  });

  it("should show error message if password has less than 16 characters", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    let passwordInput = screen.getByLabelText("Input your new password here:");

    fireEvent.change(passwordInput, {
      target: { value: "newPassword123" },
    });

    expect(passwordInput).not.toHaveClass("input-valid");
    expect(passwordInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Password length must be greater than 16 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message if password has more than 20 characters", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    let passwordInput = screen.getByLabelText("Input your new password here:");

    fireEvent.change(passwordInput, {
      target: { value: "brandNewLongerPassword123" },
    });

    expect(passwordInput).not.toHaveClass("input-valid");
    expect(passwordInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Password length must be less than 20 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message if password contains invalid characters", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    let passwordInput = screen.getByLabelText("Input your new password here:");

    fireEvent.change(passwordInput, {
      target: { value: " &()#Passw%ord123" },
    });

    expect(passwordInput).not.toHaveClass("input-valid");
    expect(passwordInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Password input contains invalid characters.")
    ).toBeInTheDocument();
  });

  it("should show error message if password contains invalid characters", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    let passwordInput = screen.getByLabelText("Input your new password here:");
    fireEvent.change(passwordInput, {
      target: { value: "test" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "" },
    });
    expect(passwordInput).not.toHaveClass("input-valid");
    expect(passwordInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should initially have disabled confirm password input that becomes enabled once password input has valid value", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    let confirmInput = screen.getByLabelText("Confirm your new password here:");
    expect(confirmInput).toBeDisabled();

    let passwordInput = screen.getByLabelText("Input your new password here:");
    fireEvent.change(passwordInput, {
      target: { value: "brandNewPassword123" },
    });

    expect(confirmInput).not.toBeDisabled();
  });

  it("should consider confirm password input valid if it matches new password input", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    fireEvent.change(screen.getByLabelText("Input your new password here:"), {
      target: { value: "brandNewPassword123" },
    });

    let confirmInput = screen.getByLabelText("Confirm your new password here:");
    fireEvent.change(confirmInput, {
      target: { value: "brandNewPassword123" },
    });
    expect(confirmInput).toHaveClass("input-valid");
    expect(confirmInput).not.toHaveClass("input-error");
  });

  it("should show error message if passwords do not match", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    fireEvent.change(screen.getByLabelText("Input your new password here:"), {
      target: { value: "brandNewPassword123" },
    });

    let confirmInput = screen.getByLabelText("Confirm your new password here:");
    fireEvent.change(confirmInput, {
      target: { value: "brandNewPassword124" },
    });
    expect(confirmInput).not.toHaveClass("input-valid");
    expect(confirmInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Does not match password above!")
    ).toBeInTheDocument();
  });

  it("should show error message if confirm password input is empty", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    fireEvent.change(screen.getByLabelText("Input your new password here:"), {
      target: { value: "brandNewPassword123" },
    });

    let confirmInput = screen.getByLabelText("Confirm your new password here:");
    fireEvent.change(confirmInput, {
      target: { value: "brandNewPassword123" },
    });
    fireEvent.change(confirmInput, {
      target: { value: "" },
    });
    expect(confirmInput).not.toHaveClass("input-valid");
    expect(confirmInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Password confirmation input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should show error message and not call submit functions if user attempts to submit form with empty/invalid inputs", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );
    let passwordInput = screen.getByLabelText("Input your new password here:");
    expect(passwordInput).toHaveClass("input-valid");
    expect(passwordInput).not.toHaveClass("input-error");
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).not.toBeInTheDocument();

    let confirmInput = screen.getByLabelText("Confirm your new password here:");
    expect(confirmInput).toHaveClass("input-valid");
    expect(confirmInput).not.toHaveClass("input-error");
    expect(
      screen.queryByText("Password confirmation input cannot be empty.")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Reset Password"));

    expect(passwordInput).not.toHaveClass("input-valid");
    expect(passwordInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).toBeInTheDocument();

    expect(confirmInput).not.toHaveClass("input-valid");
    expect(confirmInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Password confirmation input cannot be empty.")
    ).toBeInTheDocument();

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(changeStep).not.toHaveBeenCalled();
    expect(changeLoading).not.toHaveBeenCalled();
    expect(changeSubmitError).not.toHaveBeenCalled();
  });

  it("should call submit functions if user submits form with valid inputs", () => {
    renderWithRedux(
      <NewPassword
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Input your new password here:"), {
      target: { value: "brandNewPassword123" },
    });
    fireEvent.change(screen.getByLabelText("Confirm your new password here:"), {
      target: { value: "brandNewPassword123" },
    });
    fireEvent.click(screen.getByText("Reset Password"));

    expect(mockSubmit).toHaveBeenCalled();
    expect(changeStep).toHaveBeenCalled();
    expect(changeLoading).toHaveBeenCalled();
    expect(changeSubmitError).toHaveBeenCalled();
  });

  afterEach(() => {
    changeStep.mockClear();
    changeLoading.mockClear();
    changeSubmitError.mockClear();
    mockSubmit.mockClear();
  });
});
