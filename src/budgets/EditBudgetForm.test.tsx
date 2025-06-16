import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import EditBudgetForm from "./EditBudgetForm";

describe("Edit Budget Form", () => {
  let hideEditForm: Mock;
  let updateBudget: Mock;
  let mockSubmit: Mock;
  let budget: BudgetInterface;

  beforeAll(() => {
    hideEditForm = vi.fn();
    updateBudget = vi.fn();
    mockSubmit = vi.fn();
    budget = {
      _id: "12345",
      title: "test budget",
      moneyAllocated: 500,
      moneySpent: 200,
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );
  });

  it("should not show if show is false", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={false}
      />
    );
    expect(
      screen.queryByRole("form-modal", { name: "edit-budget-form" })
    ).not.toBeInTheDocument();
  });

  it("should show correct initial values for remaining funds, current funds, and total funds", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );

    expect(
      screen.queryByText("Your New Total Asset Value Will Be")
    ).toBeInTheDocument();
    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();

    expect(
      screen.queryByText("test budget Budget Will Have a New Total Value of")
    ).toBeInTheDocument();
    expect(screen.queryByText("$500.00")).toBeInTheDocument();

    expect(
      screen.queryByText(
        "test budget Budget Will Have a New Remaining Value of"
      )
    ).toBeInTheDocument();
    expect(screen.queryByText("$300.00")).toBeInTheDocument();
  });

  it("should show correct initial values for title, funds, and radio button", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );
    let titleInput = screen.getByLabelText("Budget Title:");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toContainHTML("test budget");

    let valueInput = screen.getByLabelText("New Budget Funds($ U.S.):");
    expect(valueInput).toBeInTheDocument();
    expect(valueInput).toContainHTML("$0.00");

    let add = screen.getByRole("radio", { name: "Add to Funds" });
    expect(add).toBeChecked();
    let sub = screen.getByRole("radio", { name: "Subtract from Funds" });
    expect(sub).not.toBeChecked();
  });

  it("should change value for budget title", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );
    let titleInput = screen.getByLabelText("Budget Title:");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toContainHTML("test budget");
    fireEvent.change(titleInput, { target: { value: "new test budget" } });
    expect(titleInput).toContainHTML("new test budget");
  });

  it("should show an error message if title input is empty", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );
    let titleInput = screen.getByLabelText("Budget Title:");
    expect(titleInput).toContainHTML("test budget");
    expect(
      screen.queryByText("Budget title input cannot be empty.")
    ).not.toBeInTheDocument();
    fireEvent.change(titleInput, { target: { value: "" } });
    expect(
      screen.queryByText("Budget title input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should show an error message if attempting to input an invalid title", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );
    let titleInput = screen.getByLabelText("Budget Title:");
    expect(titleInput).toContainHTML("test budget");
    expect(
      screen.queryByText("Budget title input contains invalid characters.")
    ).not.toBeInTheDocument();
    fireEvent.change(titleInput, { target: { value: " new te&st b*udget" } });
    expect(
      screen.queryByText("Budget title input contains invalid characters.")
    ).toBeInTheDocument();
  });

  it("should change value for budget value, which should change left side values", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let valueInput = screen.getByLabelText("New Budget Funds($ U.S.):");
    expect(valueInput).toContainHTML("$0.00");

    let button = screen.getByRole("button", { name: "5" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(valueInput).toContainHTML("$5.55");

    expect(screen.queryByText("$994.45")).toBeInTheDocument();
    expect(screen.queryByText("$505.55")).toBeInTheDocument();
    expect(screen.queryByText("$305.55")).toBeInTheDocument();
  });

  it("should reverse operations for values when clicking subtract radio button", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let button = screen.getByRole("button", { name: "5" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(screen.queryByText("$994.45")).toBeInTheDocument();
    expect(screen.queryByText("$505.55")).toBeInTheDocument();
    expect(screen.queryByText("$305.55")).toBeInTheDocument();

    let subtract = screen.getByRole("radio", { name: "Subtract from Funds" });
    fireEvent.click(subtract);

    expect(screen.queryByText("$1,005.55")).toBeInTheDocument();
    expect(screen.queryByText("$494.45")).toBeInTheDocument();
    expect(screen.queryByText("$294.45")).toBeInTheDocument();
  });

  it("should hide form when cancel button is clicked", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
      />
    );

    let cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toBeInTheDocument();

    fireEvent.click(cancel);
    expect(hideEditForm).toHaveBeenCalled();

    waitFor(() => {
      expect(
        screen.queryByRole("form-modal", { name: "edit-budget-form" })
      ).not.toBeInTheDocument();
    });
  });

  it("should call submit function when edit button is pressed", () => {
    renderWithReduxTestStore(
      <EditBudgetForm
        budget={budget}
        hideEditForm={hideEditForm}
        updateBudget={updateBudget}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    let submit = screen.getByRole("button", { name: "Edit Budget" });
    expect(submit).toBeInTheDocument();

    fireEvent.click(submit);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
