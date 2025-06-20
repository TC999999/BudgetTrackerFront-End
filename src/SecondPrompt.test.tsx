import { describe, it, expect, vi, beforeAll, Mock, afterEach } from "vitest";
import { renderWithReduxTestStore } from "../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import SecondPrompt from "./SecondPrompt";
import { infoInterface } from "./interfaces/miscTypes";
import { budgetFunds } from "./interfaces/budgetInterfaces";

describe("Second Prompt for Deletion", () => {
  let deleteFunction: Mock;
  let hidePrompt: Mock;
  let mockInfoExpense: infoInterface;
  let mockInfoIncome: infoInterface;
  let mockFundsExpense: budgetFunds;

  beforeAll(() => {
    deleteFunction = vi.fn();
    hidePrompt = vi.fn();
    mockInfoExpense = { _id: "12345", transaction: 250 };
    mockInfoIncome = { _id: "12345" };
    mockFundsExpense = { moneyRemaining: 200, moneySpent: 300 };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <SecondPrompt
        deleteFunction={deleteFunction}
        itemForDeletion={mockInfoExpense}
        hidePrompt={hidePrompt}
        type="Expense"
        BudgetFunds={mockFundsExpense}
        show={true}
      />
    );
  });

  it("should not show if show prop is false", () => {
    renderWithReduxTestStore(
      <SecondPrompt
        deleteFunction={deleteFunction}
        itemForDeletion={mockInfoExpense}
        hidePrompt={hidePrompt}
        type="Expense"
        BudgetFunds={mockFundsExpense}
        show={true}
      />
    );

    expect(
      screen.queryByRole("form-modal", { name: "second-prompt" })
    ).toBeInTheDocument();
  });

  it("should show correct header for an expense deletion", () => {
    renderWithReduxTestStore(
      <SecondPrompt
        deleteFunction={deleteFunction}
        itemForDeletion={mockInfoExpense}
        hidePrompt={hidePrompt}
        type="Expense"
        BudgetFunds={mockFundsExpense}
        show={true}
      />
    );

    expect(
      screen.queryByText("Are You Sure You Want To Delete This Expense?")
    ).toBeInTheDocument();
  });

  it("should show correct data if being used for an expense deletion", () => {
    renderWithReduxTestStore(
      <SecondPrompt
        deleteFunction={deleteFunction}
        itemForDeletion={mockInfoExpense}
        hidePrompt={hidePrompt}
        type="Expense"
        BudgetFunds={mockFundsExpense}
        show={true}
      />
    );

    expect(screen.queryByText("$250.00")).toBeInTheDocument();

    expect(screen.queryByText("Funds Remaining")).toBeInTheDocument();
    expect(screen.queryByText("$200.00")).toBeInTheDocument();
    expect(screen.queryByText("$450.00")).toBeInTheDocument();

    expect(screen.queryByText("Funds Spent")).toBeInTheDocument();
    expect(screen.queryByText("$300.00")).toBeInTheDocument();
    expect(screen.queryByText("$50.00")).toBeInTheDocument();
  });

  it("should show correct header for an income deletion", () => {
    renderWithReduxTestStore(
      <SecondPrompt
        deleteFunction={deleteFunction}
        hidePrompt={hidePrompt}
        itemForDeletion={mockInfoIncome}
        type="Income"
        show={true}
      />
    );

    expect(
      screen.queryByText("Are You Sure You Want To Delete This Income?")
    ).toBeInTheDocument();
  });

  it("should call handle delete function when delete button is clicked", () => {
    renderWithReduxTestStore(
      <SecondPrompt
        deleteFunction={deleteFunction}
        hidePrompt={hidePrompt}
        itemForDeletion={mockInfoIncome}
        type="Income"
        show={true}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(deleteFunction).toHaveBeenCalled();
    expect(hidePrompt).not.toHaveBeenCalled();
  });

  it("should call hide prompt function when cancel button is clicked", () => {
    renderWithReduxTestStore(
      <SecondPrompt
        deleteFunction={deleteFunction}
        hidePrompt={hidePrompt}
        itemForDeletion={mockInfoIncome}
        type="Income"
        show={true}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(deleteFunction).not.toHaveBeenCalled();
    expect(hidePrompt).toHaveBeenCalled();
  });

  afterEach(() => {
    deleteFunction.mockClear();
    hidePrompt.mockClear();
  });
});
