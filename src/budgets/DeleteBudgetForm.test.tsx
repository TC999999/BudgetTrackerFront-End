import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
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

    let r1 = screen.getByRole("radio", { name: "Return No Funds ( $0.00 )" });
    expect(r1).toBeChecked();

    let r2 = screen.getByRole("radio", {
      name: "Return Remaining Funds Only ( $300.00 )",
    });
    expect(r2).not.toBeChecked();
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

  it("should hide form when cancel button is clicked", () => {
    renderWithReduxTestStore(
      <DeleteBudgetForm hideDeleteForm={mockHide} budget={budget} show={true} />
    );

    expect(
      screen.getByRole("form-modal", { name: "delete-budget-form" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockHide).toHaveBeenCalled();

    waitFor(() => {
      expect(
        screen.getByRole("form-modal", { name: "delete-budget-form" })
      ).not.toBeInTheDocument();
    });

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

    fireEvent.click(screen.getByRole("button", { name: "Delete Budget" }));
    expect(mockSubmit).toHaveBeenCalled();
    expect(mockHide).not.toHaveBeenCalled();
  });
});
