import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import EditUserForm from "./EditUserForm";
import { EditUser } from "../interfaces/userInterfaces";

describe("Edit User Form", () => {
  let user: EditUser;
  let mockSubmit: Mock;

  beforeAll(() => {
    user = { username: "testuser", email: "testemail@gmail.com", password: "" };
    mockSubmit = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(<EditUserForm user={user} />);
  });

  it("should have correct headers", () => {
    renderWithRedux(<EditUserForm user={user} />);

    expect(
      screen.queryByText("Edit Your Information Here")
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        'Here you may edit either your username, your email address, or both. If you wish to change your password, you will need to log out and click the "Reset Your Password Here" link.'
      )
    ).toBeInTheDocument();
  });

  it("should have username input with correct initial value", () => {
    renderWithRedux(<EditUserForm user={user} />);

    let input = screen.getByLabelText("Your New Username:");
    expect(input).toBeInTheDocument();

    expect(input).toContainHTML("testuser");
    expect(input).toHaveValue("testuser");
  });

  it("should be able to change username input", () => {
    renderWithRedux(<EditUserForm user={user} />);

    let input = screen.getByLabelText("Your New Username:");
    fireEvent.change(input, { target: { value: "newTestUser" } });
    expect(input).toContainHTML("newTestUser");
    expect(input).toHaveValue("newTestUser");
  });

  it("should show an error message if username input is too short", () => {
    renderWithRedux(<EditUserForm user={user} />);

    expect(
      screen.queryByText("Username must be more than 6 characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Your New Username:"), {
      target: { value: "test" },
    });
    expect(
      screen.queryByText("Username must be more than 6 characters.")
    ).toBeInTheDocument();
  });

  it("should show an error message if username input is too long", () => {
    renderWithRedux(<EditUserForm user={user} />);

    expect(
      screen.queryByText("Username must be less than 30 characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Your New Username:"), {
      target: { value: "thisusernameiswaytoolongtobeeitherusedorsaved" },
    });
    expect(
      screen.queryByText("Username must be less than 30 characters.")
    ).toBeInTheDocument();
  });

  it("should show an error message if username input contains invalid characters", () => {
    renderWithRedux(<EditUserForm user={user} />);

    expect(
      screen.queryByText("Username input contains invalid characters.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Your New Username:"), {
      target: { value: "TestUser&*()" },
    });
    expect(
      screen.queryByText("Username input contains invalid characters.")
    ).toBeInTheDocument();
  });

  it("should show an error message if username input is empty", () => {
    renderWithRedux(<EditUserForm user={user} />);

    expect(
      screen.queryByText("Username input cannot be empty.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Your New Username:"), {
      target: { value: "" },
    });
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should have email address input with correct initial value", () => {
    renderWithRedux(<EditUserForm user={user} />);

    let input = screen.getByLabelText("Your New Email:");
    expect(input).toBeInTheDocument();

    expect(input).toContainHTML("testemail@gmail.com");
    expect(input).toHaveValue("testemail@gmail.com");
  });

  it("should be able to change email address input", () => {
    renderWithRedux(<EditUserForm user={user} />);

    let input = screen.getByLabelText("Your New Email:");
    fireEvent.change(input, { target: { value: "newTestEmail@gmail.com" } });
    expect(input).toContainHTML("newTestEmail@gmail.com");
    expect(input).toHaveValue("newTestEmail@gmail.com");
  });

  it("should show an error message if email address input is invalid", () => {
    renderWithRedux(<EditUserForm user={user} />);

    expect(
      screen.queryByText("Email address is invalid.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Your New Email:"), {
      target: { value: "testEmail" },
    });
    expect(screen.queryByText("Email address is invalid.")).toBeInTheDocument();
  });

  it("should show an error message if email address input is empty", () => {
    renderWithRedux(<EditUserForm user={user} />);

    expect(
      screen.queryByText("Email address input cannot be empty.")
    ).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Your New Email:"), {
      target: { value: "" },
    });
    expect(
      screen.queryByText("Email address input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should show error message and prevent submit if user submits a form without confirming password first", () => {
    renderWithRedux(<EditUserForm user={user} mockSubmit={mockSubmit} />);

    fireEvent.click(screen.getByText("Submit"));

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).toBeInTheDocument();
  });

  afterEach(() => {
    mockSubmit.mockClear();
  });

  it("should call mock submit function when all three inputs are filled", () => {
    renderWithRedux(<EditUserForm user={user} mockSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText("Confirm Your Password:"), {
      target: { value: "testpassword1234!!" },
    });

    fireEvent.click(screen.getByText("Submit"));

    expect(mockSubmit).toHaveBeenCalled();
  });

  afterEach(() => {
    mockSubmit.mockClear();
  });
});
