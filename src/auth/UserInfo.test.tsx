import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import UserInfo from "./UserInfo";

describe("Confirm User Info Form Before Password Reset", () => {
  let changeStep: Mock;
  let changeLoading: Mock;
  let changeSubmitError: Mock;
  let changeUser: Mock;
  let mockSubmit: Mock;

  beforeAll(() => {
    changeStep = vi.fn();
    changeLoading = vi.fn();
    changeSubmitError = vi.fn();
    changeUser = vi.fn();
    mockSubmit = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );
  });

  it("should show correct header and inputs", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    expect(
      screen.queryByText("Confirm Your Information Here")
    ).toBeInTheDocument();

    let usernameInput = screen.getByLabelText("Username:");
    expect(usernameInput).toBeInTheDocument();

    let emailInput = screen.getByLabelText("Email:");
    expect(emailInput).toBeInTheDocument();
  });

  it("should be able to change username input value", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let usernameInput = screen.getByLabelText("Username:");
    expect(usernameInput).toContainHTML("");
    expect(usernameInput).toHaveValue("");

    fireEvent.change(usernameInput, { target: { value: "testusername" } });
    expect(usernameInput).toContainHTML("testusername");
    expect(usernameInput).toHaveValue("testusername");
    expect(usernameInput).toHaveClass("input-valid");
    expect(usernameInput).not.toHaveClass("input-error");
  });

  it("should show error message if username input contains more than 30 characters", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let usernameInput = screen.getByLabelText("Username:");
    fireEvent.change(usernameInput, {
      target: { value: "ThisUsernameIsWayTooLongToBeSavedAndUsedInTheDB" },
    });

    expect(usernameInput).not.toHaveClass("input-valid");
    expect(usernameInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Username must be less than 30 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message if username input contains less than 6 characters", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let usernameInput = screen.getByLabelText("Username:");
    fireEvent.change(usernameInput, {
      target: { value: "user" },
    });

    expect(usernameInput).not.toHaveClass("input-valid");
    expect(usernameInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Username must be more than 6 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message if username input contains invalid characters", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let usernameInput = screen.getByLabelText("Username:");
    fireEvent.change(usernameInput, {
      target: { value: "  te&stuser " },
    });

    expect(usernameInput).not.toHaveClass("input-valid");
    expect(usernameInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Username input contains invalid characters.")
    ).toBeInTheDocument();
  });

  it("should be able to change email address input value", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let emailInput = screen.getByLabelText("Email:");
    expect(emailInput).toContainHTML("");
    expect(emailInput).toHaveValue("");

    fireEvent.change(emailInput, { target: { value: "testemail@gmail.com" } });
    expect(emailInput).toContainHTML("testemail@gmail.com");
    expect(emailInput).toHaveValue("testemail@gmail.com");
    expect(emailInput).toHaveClass("input-valid");
    expect(emailInput).not.toHaveClass("input-error");
  });

  it("should show an error message if email address input is invalid", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let emailInput = screen.getByLabelText("Email:");
    fireEvent.change(emailInput, { target: { value: "invalidEmailAdress" } });
    expect(emailInput).not.toHaveClass("input-valid");
    expect(emailInput).toHaveClass("input-error");
    expect(screen.queryByText("Email address is invalid.")).toBeInTheDocument();
  });

  it("should show error messages and not call any submit functions when submitting form with invalid/empty inputs", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let usernameInput = screen.getByLabelText("Username:");
    expect(usernameInput).toHaveClass("input-valid");
    expect(usernameInput).not.toHaveClass("input-error");
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).not.toBeInTheDocument();

    let emailInput = screen.getByLabelText("Email:");
    expect(emailInput).toHaveClass("input-valid");
    expect(emailInput).not.toHaveClass("input-error");
    expect(
      screen.queryByText("Email address input cannot be empty.")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Get One Time Verification Code"));

    expect(usernameInput).not.toHaveClass("input-valid");
    expect(usernameInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).toBeInTheDocument();

    expect(emailInput).not.toHaveClass("input-valid");
    expect(emailInput).toHaveClass("input-error");
    expect(
      screen.queryByText("Email address input cannot be empty.")
    ).toBeInTheDocument();

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(changeStep).not.toHaveBeenCalled();
    expect(changeLoading).not.toHaveBeenCalled();
    expect(changeUser).not.toHaveBeenCalled();
    expect(changeSubmitError).not.toHaveBeenCalled();
  });

  it("should call all submit functions when submitting form with invalid/empty inputs", () => {
    renderWithRedux(
      <UserInfo
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        changeUser={changeUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Username:"), {
      target: { value: "testusername" },
    });

    fireEvent.change(screen.getByLabelText("Email:"), {
      target: { value: "testemail@gmail.com" },
    });

    fireEvent.click(screen.getByText("Get One Time Verification Code"));

    expect(mockSubmit).toHaveBeenCalled();
    expect(changeStep).toHaveBeenCalled();
    expect(changeLoading).toHaveBeenCalled();
    expect(changeUser).toHaveBeenCalled();
    expect(changeSubmitError).toHaveBeenCalled();
  });

  afterEach(() => {
    changeStep.mockClear();
    changeLoading.mockClear();
    changeSubmitError.mockClear();
    changeUser.mockClear();
    mockSubmit.mockClear();
  });
});
