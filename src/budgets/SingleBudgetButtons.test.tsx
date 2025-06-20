import { describe, it, expect, vi, beforeAll, Mock, afterEach } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import SingleBudgetButtons from "./SingleBudgetButtons";
import { BudgetInterface } from "../interfaces/budgetInterfaces";

describe("Additional Nav Bar for Single Budget Page", () => {
  let budget: BudgetInterface;
  let showFormState: Mock;

  beforeAll(() => {
    showFormState = vi.fn();

    budget = {
      _id: "12345",
      title: "test budget",
      moneyAllocated: 500,
      moneySpent: 200,
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <SingleBudgetButtons
        currentBudget={budget}
        showFormState={showFormState}
      />
    );
  });

  it("should have three buttons for CRUD operations", () => {
    renderWithReduxTestStore(
      <SingleBudgetButtons
        currentBudget={budget}
        showFormState={showFormState}
      />
    );

    expect(
      screen.getByRole("button", { name: "Delete Budget" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Update Budget" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Add Expense" })
    ).toBeInTheDocument();
  });

  it("should call show form state mock when each of the buttons are pressed", () => {
    renderWithReduxTestStore(
      <SingleBudgetButtons
        currentBudget={budget}
        showFormState={showFormState}
      />
    );

    let del = screen.getByRole("button", { name: "Delete Budget" });
    let update = screen.getByRole("button", { name: "Update Budget" });
    let addEx = screen.getByRole("button", { name: "Add Expense" });

    fireEvent.click(del);
    fireEvent.click(update);
    fireEvent.click(addEx);

    expect(showFormState).toHaveBeenCalledTimes(3);
  });

  afterEach(() => {
    showFormState.mockClear();
  });
});
