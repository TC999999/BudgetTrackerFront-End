import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import ExpenseList from "./ExpenseList";
import {
  ExpenseInterface,
  RecentExpense,
} from "../interfaces/expenseInterfaces";

describe("Expense List", () => {
  let E: ExpenseInterface[];
  let RE: RecentExpense[];
  let filterExpense: Mock;
  let updateBudget: Mock;

  beforeAll(() => {
    filterExpense = vi.fn();
    updateBudget = vi.fn();

    E = [
      {
        _id: "3",
        title: "test expense 1",
        transaction: 400,
        date: "2025-05-20T19:04:00.000+00:00",
      },
      {
        _id: "2",
        title: "test expense 2",
        transaction: 300,
        date: "2025-05-20T19:02:00.000+00:00",
      },
      {
        _id: "1",
        title: "test expense 3",
        transaction: 200,
        date: "2025-05-20T19:00:00.000+00:00",
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

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <ExpenseList
        expensesList={E}
        isFrontPage={false}
        budgetFunds={{ moneySpent: 500, moneyRemaining: 500 }}
        budgetID="456"
        filterExpense={filterExpense}
        updateBudget={updateBudget}
      />
    );
  });

  it("should show delete table header if isFrontPage prop is false", () => {
    renderWithReduxTestStore(
      <ExpenseList
        expensesList={E}
        isFrontPage={false}
        budgetFunds={{ moneySpent: 500, moneyRemaining: 500 }}
        budgetID="456"
        filterExpense={filterExpense}
        updateBudget={updateBudget}
      />
    );

    expect(screen.queryByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Cost")).toBeInTheDocument();
    expect(screen.queryByText("Date")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).toBeInTheDocument();
    expect(screen.queryByText("Budget")).not.toBeInTheDocument();
  });

  it("should show delete table header if isFrontPage prop is true", () => {
    renderWithReduxTestStore(
      <ExpenseList expensesList={RE} isFrontPage={true} />
    );

    expect(screen.queryByText("Name")).toBeInTheDocument();
    expect(screen.queryByText("Cost")).toBeInTheDocument();
    expect(screen.queryByText("Date")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Budget")).toBeInTheDocument();
  });

  it("should show names of expenses in list", () => {
    renderWithReduxTestStore(
      <ExpenseList
        expensesList={E}
        isFrontPage={false}
        budgetFunds={{ moneySpent: 500, moneyRemaining: 500 }}
        budgetID="456"
        filterExpense={filterExpense}
        updateBudget={updateBudget}
      />
    );

    expect(screen.queryByText("test expense 1")).toBeInTheDocument();
    expect(screen.queryByText("test expense 2")).toBeInTheDocument();
    expect(screen.queryByText("test expense 3")).toBeInTheDocument();
  });

  it("should show buttons if isFrontPage prop is false", () => {
    renderWithReduxTestStore(
      <ExpenseList
        expensesList={E}
        isFrontPage={false}
        budgetFunds={{ moneySpent: 500, moneyRemaining: 500 }}
        budgetID="456"
        filterExpense={filterExpense}
        updateBudget={updateBudget}
      />
    );

    expect(
      screen.getAllByRole("button", { name: /delete-expense-button/i })
    ).toHaveLength(3);
  });
});
