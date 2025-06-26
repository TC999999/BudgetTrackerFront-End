import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import Logout from "./Logout";

describe("Log Out Window", () => {
  let hidePrompt: Mock;
  let logOutAndNavigate: Mock;

  beforeAll(() => {
    hidePrompt = vi.fn();
    logOutAndNavigate = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <Logout
        showPrompt={true}
        hidePrompt={hidePrompt}
        logOutAndNavigate={logOutAndNavigate}
      />
    );
  });

  it("should show correct prompt", () => {
    renderWithReduxTestStore(
      <Logout
        showPrompt={true}
        hidePrompt={hidePrompt}
        logOutAndNavigate={logOutAndNavigate}
      />
    );

    expect(
      screen.queryByText("Are You Sure You Want to Log Out?")
    ).toBeInTheDocument();
  });

  it("should not show window when show prop is false", () => {
    renderWithReduxTestStore(
      <Logout
        showPrompt={false}
        hidePrompt={hidePrompt}
        logOutAndNavigate={logOutAndNavigate}
      />
    );

    expect(
      screen.queryByText("Are You Sure You Want to Log Out?")
    ).not.toBeInTheDocument();
  });

  it("should only call hide prompt function when 'Cancel' button is clicked", () => {
    renderWithReduxTestStore(
      <Logout
        showPrompt={true}
        hidePrompt={hidePrompt}
        logOutAndNavigate={logOutAndNavigate}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(hidePrompt).toHaveBeenCalled();
    expect(logOutAndNavigate).not.toHaveBeenCalled();
  });

  it("should only call log out and navigate function when 'Log Out' button is clicked", () => {
    renderWithReduxTestStore(
      <Logout
        showPrompt={true}
        hidePrompt={hidePrompt}
        logOutAndNavigate={logOutAndNavigate}
      />
    );

    fireEvent.click(screen.getByText("Log Out"));
    expect(hidePrompt).not.toHaveBeenCalled();
    expect(logOutAndNavigate).toHaveBeenCalled();
  });

  afterEach(() => {
    hidePrompt.mockClear();
    logOutAndNavigate.mockClear();
  });
});
