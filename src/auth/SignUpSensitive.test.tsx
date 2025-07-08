import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import SignUpSensitive from "./SignUpSensitive";

describe("Senstive Registration Information Form", () => {
  let handleDataChange: Mock;
  let changeLoading: Mock;
  let changeStep: Mock;
  let changeSubmitError: Mock;

  beforeAll(() => {
    handleDataChange = vi.fn();
    changeLoading = vi.fn();
    changeStep = vi.fn();
    changeSubmitError = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
  });

  it("should show correct headers", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.getByText("Enter Your New Account Information Here")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Afterwards, we will send an email to the provided address with a verification code that you will have to input to create your account."
      )
    ).toBeInTheDocument();
  });

  it("should have four inputs for username, password, confirm password, and email address", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(screen.getByLabelText("Username: *")).toBeInTheDocument();
    expect(screen.getByLabelText("Password: *")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Confirm your password here: *")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email Address: *")).toBeInTheDocument();
  });

  it("should be able to change username input", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    let input = screen.getByLabelText("Username: *");

    expect(input).toContainHTML("");
    expect(input).toHaveValue("");

    fireEvent.change(input, { target: { value: "testusername" } });
    expect(input).toContainHTML("testusername");
    expect(input).toHaveValue("testusername");
  });

  it("should show error message when username is too short", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.queryByText("Username must be more than 6 characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Username: *"), {
      target: { value: "test" },
    });
    expect(
      screen.queryByText("Username must be more than 6 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message when username is too long", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.queryByText("Username must be less than 30 characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Username: *"), {
      target: { value: "thisusernameiswaytoolongtobeusedorsaved" },
    });
    expect(
      screen.queryByText("Username must be less than 30 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message when username contains invalid characters", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.queryByText("Username input contains invalid characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Username: *"), {
      target: { value: "test&)user" },
    });
    expect(
      screen.queryByText("Username input contains invalid characters.")
    ).toBeInTheDocument();
  });

  it("should be able to change password input", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    let input = screen.getByLabelText("Password: *");

    expect(input).toContainHTML("");
    expect(input).toHaveValue("");

    fireEvent.change(input, { target: { value: "testpassword1234!!" } });
    expect(input).toContainHTML("testpassword1234!!");
    expect(input).toHaveValue("testpassword1234!!");
  });

  it("should show error message when password is too short", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.queryByText("Password length must be greater than 16 characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "testpassword12" },
    });
    expect(
      screen.queryByText("Password length must be greater than 16 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message when password is too long", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.queryByText("Password length must be less than 20 characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "brandnewtestpassword1234567890" },
    });
    expect(
      screen.queryByText("Password length must be less than 20 characters.")
    ).toBeInTheDocument();
  });

  it("should show error message when password has invalid characters", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.queryByText("Password input contains invalid characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "testpassword*()" },
    });
    expect(
      screen.queryByText("Password input contains invalid characters.")
    ).toBeInTheDocument();
  });

  it("should have confirm password input be disabled until password input contains valid value", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    let input = screen.getByLabelText("Confirm your password here: *");
    expect(input).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "testpassword1234!!" },
    });
    expect(input).not.toBeDisabled();

    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "testpassword12" },
    });
    expect(input).toBeDisabled();
  });

  it("should be able to change confirm password input once password input is valid", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    let input = screen.getByLabelText("Confirm your password here: *");
    expect(input).toContainHTML("");
    expect(input).toHaveValue("");

    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "testpassword1234!!" },
    });

    fireEvent.change(input, {
      target: { value: "testpassword1234!!" },
    });

    expect(input).toContainHTML("testpassword1234!!");
    expect(input).toHaveValue("testpassword1234!!");
  });

  it("should show error message when confirm password input value does not match password input value", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.queryByText("Does not match password above!")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "testpassword1234!!" },
    });

    fireEvent.change(screen.getByLabelText("Confirm your password here: *"), {
      target: { value: "testpassword1235!!" },
    });

    expect(
      screen.queryByText("Does not match password above!")
    ).toBeInTheDocument();
  });

  it("should be able to change the email address input", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    let input = screen.getByLabelText("Email Address: *");
    expect(input).toContainHTML("");
    expect(input).toHaveValue("");

    fireEvent.change(input, { target: { value: "testemail@gmail.com" } });
    expect(input).toContainHTML("testemail@gmail.com");
    expect(input).toHaveValue("testemail@gmail.com");
  });

  it("should show an error message when email address is invalid", () => {
    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
    expect(
      screen.queryByText("Email address is invalid.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Email Address: *"), {
      target: { value: "testemail" },
    });

    expect(screen.queryByText("Email address is invalid.")).toBeInTheDocument();
  });

  it("should show error messages and not call submit functions if form with empty/invalid inputs is submitted", () => {
    let mockSubmit: Mock = vi.fn();

    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    fireEvent.click(screen.getByText("Get Verification Code"));
    expect(handleDataChange).not.toHaveBeenCalled();
    expect(changeLoading).toHaveBeenCalledTimes(1);
    expect(changeStep).not.toHaveBeenCalled();
    expect(changeSubmitError).not.toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();

    expect(
      screen.queryByText("Username input cannot be empty.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Email address input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should call all submit functions when form is submitted with valid inputs", () => {
    let mockSubmit: Mock = vi.fn();

    renderWithRedux(
      <SignUpSensitive
        handleDataChange={handleDataChange}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Username: *"), {
      target: { value: "testUsername" },
    });
    fireEvent.change(screen.getByLabelText("Password: *"), {
      target: { value: "testpassword1234!!" },
    });
    fireEvent.change(screen.getByLabelText("Confirm your password here: *"), {
      target: { value: "testpassword1234!!" },
    });
    fireEvent.change(screen.getByLabelText("Email Address: *"), {
      target: { value: "testemail@gmail.com" },
    });

    fireEvent.click(screen.getByText("Get Verification Code"));
    expect(handleDataChange).toHaveBeenCalled();
    expect(changeLoading).toHaveBeenCalledTimes(2);
    expect(changeStep).toHaveBeenCalled();
    expect(changeSubmitError).not.toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalled();
  });

  afterEach(() => {
    handleDataChange.mockClear();
    changeLoading.mockClear();
    changeStep.mockClear();
    changeSubmitError.mockClear();
  });
});
