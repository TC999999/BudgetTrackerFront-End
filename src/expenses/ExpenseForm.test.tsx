import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import ExpenseForm from "./ExpenseForm";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { DateTime } from "luxon";

describe("New Expense Form", () => {
  let hideExpenseForm: Mock;
  let addExpense: Mock;
  let updateBudget: Mock;
  let testBudget: BudgetInterface;

  beforeAll(() => {
    hideExpenseForm = vi.fn();
    addExpense = vi.fn();
    updateBudget = vi.fn();
    testBudget = {
      _id: "1",
      title: "test budget",
      moneyAllocated: 500,
      moneySpent: 100,
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );
  });

  it("should not appear when show is false", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={false}
      />
    );
    expect(screen.queryByText("Add a New Expense!")).not.toBeInTheDocument();
  });

  it("should show correct header messages", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );
    expect(screen.queryByText("Add a New Expense!")).toBeInTheDocument();
    expect(
      screen.queryByText("Remaining test budget Budget Funds:")
    ).toBeInTheDocument();
    expect(screen.queryByText("$400.00")).toBeInTheDocument();
  });

  it("should have correct form inputs", () => {
    const { container } = renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );

    expect(container.querySelector("#title")).toBeInTheDocument();
    expect(container.querySelector("#date")).toBeInTheDocument();
    expect(container.querySelector("#transaction")).toBeInTheDocument();
  });

  it("should be able to input a title", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let input = screen.getByPlaceholderText("What's this expense for?");
    expect(input).toContainHTML("");
    fireEvent.change(input, { target: { value: "Test Title" } });
    expect(input).toContainHTML("Test Title");
  });

  it("should be able to input a date", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );
    let setDate = DateTime.now().toFormat("yyyy-MM-dd'T'T");
    let input = screen.getByLabelText("Expense Date");
    expect(input).toHaveValue(setDate);
    let newDate = DateTime.local(2025, 1, 1, 15, 30, 0, 0).toFormat(
      "yyyy-MM-dd'T'T"
    );
    fireEvent.change(input, { target: { value: newDate } });
    expect(input).toHaveValue("2025-01-01T15:30");
  });

  it("should be able to input numbers", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let input = screen.getByLabelText("Expense Value ($ U.S.):");
    expect(input).toContainHTML("$0.00");
    expect(screen.queryByText("$400.00")).toBeInTheDocument();

    let five = screen.getByRole("button", { name: "5" });
    fireEvent.click(five);
    expect(input).toContainHTML("$0.05");
    expect(screen.queryByText("$399.95")).toBeInTheDocument();

    fireEvent.click(five);
    fireEvent.click(five);
    expect(input).toContainHTML("$5.55");
    expect(screen.queryByText("$394.45")).toBeInTheDocument();

    let del = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(del);
    expect(input).toContainHTML("$0.55");
    expect(screen.queryByText("$399.45")).toBeInTheDocument();
  });

  it("should display an error message if inputted title is longer than 20 characters", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let input = screen.getByPlaceholderText("What's this expense for?");
    expect(input).toContainHTML("");
    fireEvent.change(input, {
      target: { value: "This title is way too long to be used" },
    });
    expect(input).toContainHTML("This title is way too long to be used");
    expect(
      screen.queryByText("Expense title must be less than 20 characters.")
    ).toBeInTheDocument();
  });

  it("should display an error message if inputted title is shorter than 3 characters", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let input = screen.getByPlaceholderText("What's this expense for?");
    expect(input).toContainHTML("");
    fireEvent.change(input, {
      target: { value: "hi" },
    });
    expect(input).toContainHTML("hi");
    expect(
      screen.queryByText("Expense title must be greater than 3 characters.")
    ).toBeInTheDocument();
  });

  it("should display an error message if form is submitted with empty inputs", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let submit = screen.getByRole("button", { name: "Add this Expense" });
    fireEvent.click(submit);
    expect(
      screen.queryByText("Expense title input cannot be empty.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Expense value must be greater than $0.00.")
    ).toBeInTheDocument();
  });

  it("should run a submit function when submit button is clicked", () => {
    let handleSubmit = vi.fn();
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
        mock={handleSubmit}
      />
    );
    let submit = screen.getByRole("button", { name: "Add this Expense" });
    fireEvent.click(submit);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it("should hide form when cancel button is clicked", () => {
    renderWithReduxTestStore(
      <ExpenseForm
        hideExpenseForm={hideExpenseForm}
        budget={testBudget}
        addExpense={addExpense}
        updateBudget={updateBudget}
        show={true}
      />
    );

    expect(
      screen.getByRole("form-modal", { name: "add-expense-form" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(hideExpenseForm).toHaveBeenCalled();

    waitFor(() => {
      expect(
        screen.getByRole("form-modal", { name: "add-expense-form" })
      ).not.toBeInTheDocument();
    });
  });
});
