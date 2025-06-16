import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import Dashboard from "./Dashboard";

describe("Main User Dashboard", () => {
  let mock: Mock;

  beforeAll(() => {
    mock = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<Dashboard mock={mock} />);
  });

  it("should have a user dashboard card", () => {
    renderWithReduxTestStore(<Dashboard mock={mock} />);
    expect(screen.queryByText("testuser")).toBeInTheDocument();
    expect(screen.queryByText("Total Savings Available:")).toBeInTheDocument();
    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Document a Transaction" })
    ).toBeInTheDocument();
  });

  it("should show a form for new changes to total savings", () => {
    renderWithReduxTestStore(<Dashboard mock={mock} />);
    expect(
      screen.queryByText("Document a Miscellaneous Transaction")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Your New Total Savings Value Will Be:")
    ).not.toBeInTheDocument();

    let button = screen.getByRole("button", { name: "Document a Transaction" });
    fireEvent.click(button);
    expect(
      screen.queryByText("Document a Miscellaneous Transaction")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Your New Total Savings Value Will Be:")
    ).toBeInTheDocument();

    let cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toBeInTheDocument();
    fireEvent.click(cancel);

    waitFor(() => {
      expect(
        screen.queryByText("Document a Miscellaneous Transaction")
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Your New Total Savings Value Will Be:")
      ).not.toBeInTheDocument();
    });
  });

  it("should show a table of recent changes to savings", () => {
    renderWithReduxTestStore(<Dashboard mock={mock} />);
    expect(screen.queryByText("Recent Savings Changes")).toBeInTheDocument();
    expect(screen.queryByText("Recent Budget Expenses")).toBeInTheDocument();
    expect(screen.queryByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Value")).toBeInTheDocument();
    expect(screen.queryByText("Date")).toBeInTheDocument();
    expect(screen.queryByText("Balance")).toBeInTheDocument();
    expect(screen.queryByText("Income")).toBeInTheDocument();
    expect(screen.queryByText("Transaction")).toBeInTheDocument();
    expect(screen.queryByText("Budget")).toBeInTheDocument();
  });
});
