import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import BudgetPageButtons from "./BudgetPageButtons";

describe("Budget Page Additional Nav Button", () => {
  let mock: Mock;

  beforeAll(() => {
    mock = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <BudgetPageButtons budgetListLength={5} showForm={mock} />
    );
  });

  it("should show correct text", () => {
    renderWithReduxTestStore(
      <BudgetPageButtons budgetListLength={5} showForm={mock} />
    );
    expect(screen.queryByText("Add a new Budget")).toBeInTheDocument();
  });

  it("should call mock function when pressed", () => {
    renderWithReduxTestStore(
      <BudgetPageButtons budgetListLength={5} showForm={mock} />
    );
    let button = screen.getByRole("button", { name: "Add a new Budget" });
    fireEvent.click(button);
    expect(mock).toHaveBeenCalled();
  });
});
