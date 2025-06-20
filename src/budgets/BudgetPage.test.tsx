import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import BudgetPage from "./BudgetPage";

describe("Budget List Page", () => {
  let mock: Mock;

  beforeAll(() => {
    mock = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<BudgetPage mock={mock} />);
  });

  it("should show a button to add a new budget", () => {
    renderWithReduxTestStore(<BudgetPage mock={mock} />);
    let button = screen.getByRole("button", { name: "Add a new Budget" });
    expect(button).toBeInTheDocument();
  });

  it("should show a form when add new budget button is pressed and hide when 'Cancel' button is pressed", async () => {
    renderWithReduxTestStore(<BudgetPage mock={mock} />);
    expect(
      screen.queryByRole("form-modal", { name: "new-budget-form" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add a new Budget" }));
    expect(
      screen.queryByRole("form-modal", { name: "new-budget-form" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("form-modal", { name: "new-budget-form" })
      ).not.toBeInTheDocument();
    });
  });

  it("should show correct list header", () => {
    renderWithReduxTestStore(<BudgetPage mock={mock} />);
    expect(screen.queryByText("All Current Budgets")).toBeInTheDocument();
    expect(screen.queryByText("(0/10)")).toBeInTheDocument();
  });

  it("should show message that user has no budgets in list", () => {
    renderWithReduxTestStore(<BudgetPage mock={mock} />);
    expect(
      screen.queryByText("You currently have no budgets")
    ).toBeInTheDocument();
  });
});
