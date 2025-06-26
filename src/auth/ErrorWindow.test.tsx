import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import ErrorWindow from "./ErrorWindow";

describe("Authorization Process Error Window", () => {
  let changeSubmitError: Mock;

  beforeAll(() => {
    changeSubmitError = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <ErrorWindow
        changeSubmitError={changeSubmitError}
        submitError="Test Error"
      />
    );
  });

  it("should contain submit error message", () => {
    renderWithRedux(
      <ErrorWindow
        changeSubmitError={changeSubmitError}
        submitError="Test Error"
      />
    );

    expect(screen.queryByText("Test Error")).toBeInTheDocument();
    expect(screen.queryByTitle("auth-error-window")).toBeInTheDocument();
  });

  it("should not show window if submit error string is empty", () => {
    renderWithRedux(
      <ErrorWindow changeSubmitError={changeSubmitError} submitError="" />
    );

    expect(screen.queryByTitle("auth-error-window")).not.toBeInTheDocument();
  });

  it("should call change submit error function when 'Exit' button is clicked", () => {
    renderWithRedux(
      <ErrorWindow
        changeSubmitError={changeSubmitError}
        submitError="Test Error"
      />
    );

    fireEvent.click(screen.getByText("Exit"));
    expect(changeSubmitError).toHaveBeenCalled();
  });

  afterEach(() => {
    changeSubmitError.mockClear();
  });
});
