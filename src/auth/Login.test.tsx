import { describe, it, expect, vi } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import LogIn from "./LogIn";

describe("Login", () => {
  it("should render without crashing", () => {
    renderWithRedux(<LogIn />);
  });

  it("should have username and password inputs only", () => {
    const { container } = renderWithRedux(<LogIn />);
    const username_input = container.querySelector("#login_username");
    const password_input = container.querySelector("#login_password");
    const email_input = container.querySelector("#login_email");
    expect(username_input).toBeInTheDocument();
    expect(password_input).toBeInTheDocument();
    expect(email_input).not.toBeInTheDocument();
  });

  it("should show trusted checkbox and change value", () => {
    renderWithRedux(<LogIn />);
    const checkBox = screen.getByRole("checkbox");
    expect(checkBox).toBeInTheDocument();
    expect(checkBox).toBeChecked();
    fireEvent.click(checkBox);
    expect(checkBox).not.toBeChecked();
  });

  it("should enter username", () => {
    renderWithRedux(<LogIn />);
    const username_input = screen.getByPlaceholderText(
      "type your username here"
    );
    expect(username_input).toContainHTML("");
    fireEvent.change(username_input, { target: { value: "testuser" } });
    expect(username_input).toContainHTML("testuser");
  });

  it("should show error message on screen when username input contains errors", () => {
    renderWithRedux(<LogIn />);
    const username_input = screen.getByPlaceholderText(
      "type your username here"
    );
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).not.toBeInTheDocument();
    expect(username_input).toContainHTML("");
    fireEvent.change(username_input, { target: { value: "testuser" } });
    expect(username_input).toContainHTML("testuser");
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).not.toBeInTheDocument();
    fireEvent.change(username_input, { target: { value: "" } });
    expect(username_input).toContainHTML("");
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should enter password", () => {
    renderWithRedux(<LogIn />);
    const password_input = screen.getByPlaceholderText(
      "type your password here"
    );
    expect(password_input).toContainHTML("");
    fireEvent.change(password_input, { target: { value: "testpassword123" } });
    expect(password_input).toContainHTML("testpassword123");
  });

  it("should show error message on screen when password input contains errors", () => {
    renderWithRedux(<LogIn />);
    const password_input = screen.getByPlaceholderText(
      "type your password here"
    );
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).not.toBeInTheDocument();
    fireEvent.change(password_input, { target: { value: "testpassword123" } });
    expect(password_input).toContainHTML("testpassword123");
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).not.toBeInTheDocument();
    fireEvent.change(password_input, { target: { value: "" } });
    expect(password_input).toContainHTML("");
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should show error message on screen when attempting to submit form when inputs are empty", () => {
    renderWithRedux(<LogIn />);
    const button = screen.getByRole("button", { name: "Log In!" });
    expect(button).toBeInTheDocument();
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(
      screen.queryByText("Username input cannot be empty.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Password input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should call a handleSubmit function when both inputs have content", () => {
    const handleSubmit = vi.fn();
    renderWithRedux(<LogIn onSubmit={handleSubmit} />);
    const username_input = screen.getByPlaceholderText(
      "type your username here"
    );
    fireEvent.change(username_input, { target: { value: "testuser" } });
    const password_input = screen.getByPlaceholderText(
      "type your password here"
    );
    fireEvent.change(password_input, { target: { value: "testpassword123" } });
    const button = screen.getByRole("button", { name: "Log In!" });
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalled();
  });
});
