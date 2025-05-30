import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar", () => {
  let navigate: Mock;

  beforeAll(() => {
    navigate = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<Navbar />);
  });

  it("should show website logo", () => {
    renderWithReduxTestStore(<Navbar />);
    expect(screen.queryByText("Personal Piggybank")).toBeInTheDocument();
  });

  it("should show four navigate buttons", () => {
    renderWithReduxTestStore(<Navbar />);
    expect(screen.queryByText("Log Out")).toBeInTheDocument();
    expect(screen.queryByText("Savings Changes")).toBeInTheDocument();
    expect(screen.queryByText("Incomes")).toBeInTheDocument();
    expect(screen.queryByText("Budgets")).toBeInTheDocument();
  });

  it("should call a navigate function when one of the three navigate buttons are pressed", () => {
    renderWithReduxTestStore(<Navbar mock={navigate} />);
    let button = screen.getByRole("button", { name: "Budgets" });
    fireEvent.click(button);
    expect(navigate).toHaveBeenCalled();
  });

  it("should show a prompt when user clicks log out button", () => {
    renderWithReduxTestStore(<Navbar />);
    let button = screen.getByRole("button", { name: "Log Out" });
    expect(
      screen.queryByText("Are You Sure You Want to Log Out?")
    ).not.toBeInTheDocument();
    fireEvent.click(button);
    expect(
      screen.queryByText("Are You Sure You Want to Log Out?")
    ).toBeInTheDocument();
  });
});
