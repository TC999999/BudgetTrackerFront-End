import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import Recents from "./Recents";
import { RecentExpense } from "../interfaces/expenseInterfaces";
import { Transaction } from "../interfaces/transactionInterfaces";

describe("User Recent Activity Table", () => {
  let RT: Transaction[];
  let RE: RecentExpense[];

  beforeAll(() => {
    RT = [
      {
        _id: "3",
        date: "2025-05-22T19:04:00.000+00:00",
        fromIncome: false,
        operation: "subtract",
        title: "test transaction",
        transaction: 1000,
        budgetOperation: "-",
        newBalance: 3000,
      },
      {
        _id: "2",
        date: "2025-05-22T19:03:00.000+00:00",
        fromIncome: false,
        operation: "subtract",
        title: "test budget",
        transaction: 1000,
        budgetOperation: "Created",
        newBalance: 4000,
      },
      {
        _id: "1",
        date: "2025-05-22T19:02:00.000+00:00",
        fromIncome: true,
        operation: "add",
        title: "test income",
        transaction: 1000,
        budgetOperation: "-",
        newBalance: 5000,
      },
    ];

    RE = [
      {
        _id: "3",
        title: "test expense 1",
        transaction: 400,
        date: "2025-05-20T19:04:00.000+00:00",
        budget: "test budget",
        budgetID: "456",
      },
      {
        _id: "2",
        title: "test expense 2",
        transaction: 300,
        date: "2025-05-20T19:02:00.000+00:00",
        budget: "test budget",
        budgetID: "456",
      },
      {
        _id: "1",
        title: "test expense 3",
        transaction: 200,
        date: "2025-05-20T19:00:00.000+00:00",
        budget: "test budget",
        budgetID: "456",
      },
    ];
  });

  it("renders without crashing", () => {
    renderWithReduxTestStore(<Recents transactions={RT} expenses={RE} />);
  });

  it("shows both tabs", () => {
    renderWithReduxTestStore(<Recents transactions={RT} expenses={RE} />);
    expect(screen.queryByText("Recent Savings Changes")).toBeInTheDocument();
    expect(screen.queryByText("Recent Budget Expenses")).toBeInTheDocument();
  });

  it("initially shows items in recent savings changes table", () => {
    renderWithReduxTestStore(<Recents transactions={RT} expenses={RE} />);
    expect(screen.queryByText("test transaction")).toBeInTheDocument();
    expect(screen.queryByText("test budget")).toBeInTheDocument();
    expect(screen.queryByText("test income")).toBeInTheDocument();
    expect(screen.queryByText("test expense 1")).not.toBeInTheDocument();
    expect(screen.queryByText("test expense 2")).not.toBeInTheDocument();
    expect(screen.queryByText("test expense 3")).not.toBeInTheDocument();
  });

  it("shows items in recent budget expenses table when tab is clicked", () => {
    renderWithReduxTestStore(<Recents transactions={RT} expenses={RE} />);
    let eTab = screen.getByRole("tab", { name: "Recent Budget Expenses" });
    fireEvent.click(eTab);
    expect(screen.queryByText("test expense 1")).toBeInTheDocument();
    expect(screen.queryByText("test expense 2")).toBeInTheDocument();
    expect(screen.queryByText("test expense 3")).toBeInTheDocument();
  });
});
