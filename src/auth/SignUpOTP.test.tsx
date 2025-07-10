import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import SignUpOTP from "./SignUpOTP";
import { SignUpInterface } from "../interfaces/authInterfaces";

describe("Registration Verification Code Form", () => {
  let registerData: SignUpInterface;
  let changeLoading: Mock;
  let changeStep: Mock;
  let changeSubmitError: Mock;
  let mockSubmit: Mock;

  beforeAll(() => {
    registerData = {
      username: "testUsername",
      password: "testPassword1234!!",
      totalAssets: 0,
      email: "testEmail@gmail.com",
      incomes: [],
      trusted: true,
    };

    changeLoading = vi.fn();
    changeStep = vi.fn();
    changeSubmitError = vi.fn();
    mockSubmit = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <SignUpOTP
        registerData={registerData}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
  });

  it("should contain correct headers", () => {
    renderWithRedux(
      <SignUpOTP
        registerData={registerData}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.getByText("One-Time-One-Use Verification Code")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "A 6-digit verification code was just sent to the provided email. This code will expire after 10 minutes. Please enter the code below."
      )
    ).toBeInTheDocument();
  });

  it("should contain six boxes for inputted digits, with initial values of 0 for each one", () => {
    let { container } = renderWithRedux(
      <SignUpOTP
        registerData={registerData}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
    let d = container.getElementsByClassName("digitPlace");

    expect(d).toHaveLength(6);
    expect(d[0]).toContainHTML("0");
    expect(d[1]).toContainHTML("0");
    expect(d[2]).toContainHTML("0");
    expect(d[3]).toContainHTML("0");
    expect(d[4]).toContainHTML("0");
    expect(d[5]).toContainHTML("0");
  });

  it("should contain a keypad initially with 10 numbers 0 through 9", () => {
    let { container } = renderWithRedux(
      <SignUpOTP
        registerData={registerData}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
    let keypad = container.getElementsByClassName("button");
    expect(keypad).toHaveLength(10);
    expect(keypad[0]).toContainHTML("1");
    expect(keypad[1]).toContainHTML("2");
    expect(keypad[2]).toContainHTML("3");
    expect(keypad[3]).toContainHTML("4");
    expect(keypad[4]).toContainHTML("5");
    expect(keypad[5]).toContainHTML("6");
    expect(keypad[6]).toContainHTML("7");
    expect(keypad[7]).toContainHTML("8");
    expect(keypad[8]).toContainHTML("9");
    expect(keypad[9]).toContainHTML("0");
  });

  it("should insert number of keypad button into digit box when clicked; also inserts next pressed number into next box", () => {
    let { container } = renderWithRedux(
      <SignUpOTP
        registerData={registerData}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
    let keypad = container.getElementsByClassName("button");
    let digitBoxes = container.getElementsByClassName("digitPlace");
    fireEvent.click(keypad[3]);
    expect(digitBoxes[0]).toContainHTML("4");
    fireEvent.click(keypad[9]);
    expect(digitBoxes[1]).toContainHTML("0");
    fireEvent.click(keypad[0]);
    expect(digitBoxes[2]).toContainHTML("1");
    fireEvent.click(keypad[5]);
    expect(digitBoxes[3]).toContainHTML("6");
    fireEvent.click(keypad[1]);
    expect(digitBoxes[4]).toContainHTML("2");
    fireEvent.click(keypad[6]);
    expect(digitBoxes[5]).toContainHTML("7");

    let del = container.getElementsByClassName("button-delete");
    fireEvent.click(del[0]);
    expect(digitBoxes[5]).toContainHTML("0");
  });

  it("should fail to call submit functions and calls error function if all boxes are not filled", () => {
    renderWithRedux(
      <SignUpOTP
        registerData={registerData}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
        mockSubmit={mockSubmit}
      />
    );
    fireEvent.click(screen.getByText("Submit Code"));
    expect(changeLoading).not.toHaveBeenCalled();
    expect(changeStep).not.toHaveBeenCalled();
    expect(changeSubmitError).toHaveBeenCalled();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it("should call submit functions if all boxes are filled", () => {
    let { container } = renderWithRedux(
      <SignUpOTP
        registerData={registerData}
        changeLoading={changeLoading}
        changeStep={changeStep}
        changeSubmitError={changeSubmitError}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let keypad = container.getElementsByClassName("button");
    fireEvent.click(keypad[3]);
    fireEvent.click(keypad[9]);
    fireEvent.click(keypad[0]);
    fireEvent.click(keypad[5]);
    fireEvent.click(keypad[1]);
    fireEvent.click(keypad[6]);

    fireEvent.click(screen.getByText("Submit Code"));
    expect(changeLoading).toHaveBeenCalled();
    expect(changeStep).toHaveBeenCalled();
    expect(changeSubmitError).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalled();
  });

  afterEach(() => {
    changeLoading.mockClear();
    changeStep.mockClear();
    changeSubmitError.mockClear();
    mockSubmit.mockClear();
  });
});
