import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import PasswordResetSuccess from "./PasswordResetSuccess";

describe("Password Reset Success Message", () => {
  let mockNav: Mock;

  beforeAll(() => {
    mockNav = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(<PasswordResetSuccess show={true} mockNav={mockNav} />);
  });

  it("should show correct message", () => {
    renderWithRedux(<PasswordResetSuccess show={true} mockNav={mockNav} />);

    expect(
      screen.queryByText("Your password has been successfully reset!")
    ).toBeInTheDocument();
  });

  it("should call mock navigate function when 'Go back to Login page' button is clicked", () => {
    renderWithRedux(<PasswordResetSuccess show={true} mockNav={mockNav} />);

    fireEvent.click(screen.getByText("Go back to Login page"));
    expect(mockNav).toHaveBeenCalled();
  });

  afterEach(() => {
    mockNav.mockClear();
  });
});
