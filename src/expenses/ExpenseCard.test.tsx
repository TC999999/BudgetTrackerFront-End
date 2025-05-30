import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import {
  ExpenseInterface,
  RecentExpense,
} from "../interfaces/expenseInterfaces";
import ExpenseCard from "./ExpenseCard";

describe("Expense Card", () => {
  let e1: ExpenseInterface;
  let e2: RecentExpense;
  let showSecondPrompt: Mock;

  beforeAll(() => {
    showSecondPrompt = vi.fn();

    e1 = {
      _id: "1",
      title: "test expense",
      transaction: 100,
      date: "2025-05-22T19:02:00.000+00:00",
    };

    e2 = {
      _id: "2",
      title: "test expense 2",
      transaction: 100,
      date: "2025-05-22T19:04:00.000+00:00",
      budgetID: "100",
      budget: "test budget",
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <ExpenseCard expense={e1} showSecondPrompt={showSecondPrompt} />
    );
  });

  it("should show correct info for regular expense", () => {
    renderWithReduxTestStore(
      <ExpenseCard expense={e1} showSecondPrompt={showSecondPrompt} />
    );

    expect(screen.queryByText("test expense"));
    expect(screen.queryByText("$100.00"));
    expect(screen.queryByText("May 22, 2025")).toBeInTheDocument();
    expect(screen.queryByText("03:02 PM")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should call second prompt window when delete button is clicked", () => {
    renderWithReduxTestStore(
      <ExpenseCard expense={e1} showSecondPrompt={showSecondPrompt} />
    );
    let button = screen.getByRole("button");
    fireEvent.click(button);
    expect(showSecondPrompt).toHaveBeenCalled();
  });

  it("should show correct info for recent expense", () => {
    renderWithReduxTestStore(
      <ExpenseCard expense={e2} showSecondPrompt={showSecondPrompt} />
    );

    expect(screen.queryByText("test expense 2"));
    expect(screen.queryByText("$100.00"));
    expect(screen.queryByText("May 22, 2025")).toBeInTheDocument();
    expect(screen.queryByText("03:04 PM")).toBeInTheDocument();
    expect(screen.queryByText("test budget")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
