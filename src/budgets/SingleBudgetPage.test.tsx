import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import SingleBudgetPage from "./SingleBudgetPage";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";

describe("Single Budget Page", () => {
  let mockBudget: BudgetInterface;
  let mockExpenses: ExpenseInterface[];

  beforeAll(() => {
    mockBudget = {
      _id: "12345",
      title: "test budget",
      moneyAllocated: 1000,
      moneySpent: 650,
    };

    mockExpenses = [
      {
        _id: "3",
        title: "test expense 1",
        transaction: 150,
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
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <SingleBudgetPage mockBudget={mockBudget} mockExpenses={mockExpenses} />
    );
  });

  it("should have a card with correct title and values", () => {
    renderWithReduxTestStore(
      <SingleBudgetPage mockBudget={mockBudget} mockExpenses={mockExpenses} />
    );

    let card = screen.getByRole("card", { name: "budget-page-card" });
    expect(card).toHaveTextContent("test budget");
    expect(card).toHaveTextContent("$1,000.00");
    expect(card).toHaveTextContent("$650.00");
    expect(card).toHaveTextContent("$350.00");
  });

  it("should have additional buttons at the top for budget CRUD operations", () => {
    renderWithReduxTestStore(
      <SingleBudgetPage mockBudget={mockBudget} mockExpenses={mockExpenses} />
    );

    expect(
      screen.getByRole("navigation", { name: "budget-page-nav" })
    ).toBeInTheDocument();
  });

  it("should show expense form when 'Add Expense' button is clicked and hide form when 'Cancel' button is clicked", async () => {
    renderWithReduxTestStore(
      <SingleBudgetPage mockBudget={mockBudget} mockExpenses={mockExpenses} />
    );

    expect(
      screen.queryByRole("form-modal", {
        name: "add-expense-form",
      })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Add Expense"));

    expect(
      screen.queryByRole("form-modal", {
        name: "add-expense-form",
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByRole("form-modal", {
          name: "add-expense-form",
        })
      ).not.toBeInTheDocument();
    });
  });

  it("should show delete form when 'Delete Budget' button is clicked and hide form when 'Cancel' button is clicked", async () => {
    renderWithReduxTestStore(
      <SingleBudgetPage mockBudget={mockBudget} mockExpenses={mockExpenses} />
    );

    expect(
      screen.queryByRole("form-modal", {
        name: "delete-budget-form",
      })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete Budget"));

    expect(
      screen.queryByRole("form-modal", {
        name: "delete-budget-form",
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByRole("form-modal", {
          name: "delete-budget-form",
        })
      ).not.toBeInTheDocument();
    });
  });

  it("should show update budget form when 'Update Budget' button is clicked and hide form when 'Cancel' button is clicked", async () => {
    renderWithReduxTestStore(
      <SingleBudgetPage mockBudget={mockBudget} mockExpenses={mockExpenses} />
    );

    expect(
      screen.queryByRole("form-modal", {
        name: "edit-budget-form",
      })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Update Budget"));

    expect(
      screen.queryByRole("form-modal", {
        name: "edit-budget-form",
      })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByRole("form-modal", {
          name: "edit-budget-form",
        })
      ).not.toBeInTheDocument();
    });
  });

  it("should show list of expenses", () => {
    const { container } = renderWithReduxTestStore(
      <SingleBudgetPage mockBudget={mockBudget} mockExpenses={mockExpenses} />
    );
    expect(container.getElementsByClassName("expense-card")).toHaveLength(3);
  });
});
