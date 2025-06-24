import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import DeleteBudgetForm from "./DeleteBudgetForm";

describe("Delete Budget Form", () => {
  let mockHide: Mock;

  let budget: BudgetInterface;
  let budget2: BudgetInterface;

  beforeAll(() => {
    mockHide = vi.fn();

    budget = {
      _id: "12345",
      title: "test budget",
      moneyAllocated: 500,
      moneySpent: 200,
    };

    budget2 = {
      _id: "12345",
      title: "test budget",
      moneyAllocated: 500,
      moneySpent: 0,
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm hideDeleteForm={mockHide} budget={budget} show={true} />
    );
  });

  it("should not show if show prop is false", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm
        hideDeleteForm={mockHide}
        budget={budget}
        show={false}
      />
    );
    expect(
      screen.queryByRole("form-modal", { name: "delete-budget-form" })
    ).not.toBeInTheDocument();
  });

  it("should show three radio buttons when money spent is greater than $0.00", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm hideDeleteForm={mockHide} budget={budget} show={true} />
    );

    expect(
      screen.getByRole("radio", { name: "Return No Funds ( $0.00 )" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: "Return Remaining Funds Only ( $300.00 )",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("radio", {
        name: "Return All Funds ( $500.00 )",
      })
    ).toBeInTheDocument();
  });

  it("should show two radio buttons when money spent is equal to $0.00", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm
        hideDeleteForm={mockHide}
        budget={budget2}
        show={true}
      />
    );

    expect(
      screen.queryByRole("radio", { name: "Return No Funds ( $0.00 )" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("radio", {
        name: "Return Remaining Funds Only ( $300.00 )",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("radio", {
        name: "Return All Funds ( $500.00 )",
      })
    ).toBeInTheDocument();
  });

  it("should have return no funds button initially checked", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm hideDeleteForm={mockHide} budget={budget} show={true} />
    );

    expect(
      screen.getByRole("radio", { name: "Return No Funds ( $0.00 )" })
    ).toBeChecked();

    expect(
      screen.getByRole("radio", {
        name: "Return Remaining Funds Only ( $300.00 )",
      })
    ).not.toBeChecked();
  });

  it("should have check radio button when clicked", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm hideDeleteForm={mockHide} budget={budget} show={true} />
    );
    let r = screen.getByRole("radio", {
      name: "Return Remaining Funds Only ( $300.00 )",
    });
    expect(r).not.toBeChecked();

    fireEvent.click(r);
    expect(r).toBeChecked();
  });

  it("should call mock hide form function and reset to initial data when cancel button is clicked", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm hideDeleteForm={mockHide} budget={budget} show={true} />
    );

    let r1 = screen.getByRole("radio", { name: "Return No Funds ( $0.00 )" });
    expect(r1).toBeChecked();

    let r2 = screen.getByRole("radio", {
      name: "Return Remaining Funds Only ( $300.00 )",
    });
    fireEvent.click(r2);
    expect(r1).not.toBeChecked();

    expect(
      screen.getByRole("form-modal", { name: "delete-budget-form" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockHide).toHaveBeenCalled();
    expect(r1).toBeChecked();

    mockHide.mockClear();
  });

  it("should call mock submit function when delete button is pressed", () => {
    let mockSubmit: Mock = vi.fn();
    renderWithReduxTestStore(
      <DeleteBudgetForm
        hideDeleteForm={mockHide}
        budget={budget}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    fireEvent.click(screen.getByText("Delete Budget"));
    expect(mockSubmit).toHaveBeenCalled();
    expect(mockHide).not.toHaveBeenCalled();
  });
});
