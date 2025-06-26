import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import OneTimeCode from "./OneTimeCode";
import { ConfirmUserInfo } from "../interfaces/authInterfaces";

describe("One Time Verification Code Form for Password Reset", () => {
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
      <OneTimeCode
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );
  });

  it("should show correct header and initially have 6 digit boxes with zeroes", () => {
    renderWithRedux(
      <OneTimeCode
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    expect(
      screen.queryByText("One-Time-One-Use Verification Code")
    ).toBeInTheDocument();

    let digitBoxes = screen.getAllByRole("digit-box");
    expect(digitBoxes).toHaveLength(6);
    expect(digitBoxes[0]).toContainHTML("0");
    expect(digitBoxes[1]).toContainHTML("0");
    expect(digitBoxes[2]).toContainHTML("0");
    expect(digitBoxes[3]).toContainHTML("0");
    expect(digitBoxes[4]).toContainHTML("0");
    expect(digitBoxes[5]).toContainHTML("0");
  });

  it("should insert single digit number into each box based on keypad button click", () => {
    renderWithRedux(
      <OneTimeCode
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
      />
    );

    let five = screen.getByRole("button", { name: "5" });
    let digitBoxes = screen.getAllByRole("digit-box");

    fireEvent.click(five);

    expect(digitBoxes[0]).toContainHTML("5");
    expect(digitBoxes[1]).toContainHTML("0");

    fireEvent.click(five);
    expect(digitBoxes[1]).toContainHTML("5");

    fireEvent.click(screen.getByText("Delete"));
    expect(digitBoxes[1]).toContainHTML("0");
  });

  it("should not call submit functions if all boxes do not contain digits, should call submit error function", () => {
    renderWithRedux(
      <OneTimeCode
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let five = screen.getByRole("button", { name: "5" });

    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(screen.getByText("Submit Code"));

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(changeStep).not.toHaveBeenCalled();
    expect(changeLoading).not.toHaveBeenCalled();
    expect(changeSubmitError).toHaveBeenCalled();
  });

  it("should call all submit functions if all boxes contain digits", () => {
    renderWithRedux(
      <OneTimeCode
        changeStep={changeStep}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        currentUser={currentUser}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let five = screen.getByRole("button", { name: "5" });

    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(screen.getByText("Submit Code"));

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
