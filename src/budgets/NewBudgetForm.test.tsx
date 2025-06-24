import { describe, it, expect, vi, beforeAll, Mock, afterEach } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import BudgetForm from "./NewBudgetForm";

describe("New Budget Form", () => {
  let hideForm: Mock;
  let addBudget: Mock;
  let handleSubmit: Mock;

  beforeAll(() => {
    hideForm = vi.fn();
    addBudget = vi.fn();
    handleSubmit = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );
  });

  it("should not show form if show prop is false", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={false} />
    );

    expect(
      screen.queryByRole("form-modal", { name: "new-budget-form" })
    ).not.toBeInTheDocument();
  });

  it("should show correct headers and initial values", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );

    expect(screen.queryByText("New Budget Information")).toBeInTheDocument();
    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();

    let titleInput = screen.getByLabelText("Budget Title:");
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue("");

    let valueInput = screen.getByLabelText("Money Allocated ($ U.S.):");
    expect(valueInput).toBeInTheDocument();
    expect(valueInput).toHaveValue("$0.00");
  });

  it("should be able to change title via input", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );

    let titleInput = screen.getByLabelText("Budget Title:");
    expect(titleInput).toContainHTML("");
    expect(titleInput).toHaveValue("");

    fireEvent.change(titleInput, { target: { value: "test budget" } });

    expect(titleInput).toContainHTML("test budget");
    expect(titleInput).toHaveValue("test budget");
  });

  it("should show an error message if title input is invalid", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );

    let titleInput = screen.getByLabelText("Budget Title:");

    fireEvent.change(titleInput, {
      target: { value: "this title is way to long to be used" },
    });
    expect(
      screen.queryByText("Budget title must be less than 20 characters.")
    ).toBeInTheDocument();

    fireEvent.change(titleInput, {
      target: { value: "hi" },
    });
    expect(
      screen.queryByText("Budget title must be greater than 3 characters.")
    ).toBeInTheDocument();

    fireEvent.change(titleInput, {
      target: { value: "" },
    });
    expect(
      screen.queryByText("Budget title input cannot be empty.")
    ).toBeInTheDocument();

    fireEvent.change(titleInput, {
      target: { value: "  test) title+   " },
    });
    expect(
      screen.queryByText("Budget title input contains invalid characters.")
    ).toBeInTheDocument();
  });

  it("should be able to change value input with keypad and change remaining funds header", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );

    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();

    let valueInput = screen.getByLabelText("Money Allocated ($ U.S.):");
    expect(valueInput).toContainHTML("$0.00");
    expect(valueInput).toHaveValue("$0.00");

    let five = screen.getByRole("button", { name: "5" });

    fireEvent.click(five);
    expect(valueInput).toContainHTML("$0.05");
    expect(valueInput).toHaveValue("$0.05");
    expect(screen.queryByText("$999.95")).toBeInTheDocument();

    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    expect(valueInput).toContainHTML("$555.55");
    expect(valueInput).toHaveValue("$555.55");
    expect(screen.queryByText("$444.45")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Delete"));
    expect(valueInput).toContainHTML("$55.55");
    expect(valueInput).toHaveValue("$55.55");
    expect(screen.queryByText("$944.45")).toBeInTheDocument();
  });

  it("should show an error message if inputted value is greater than total savings and does not change values", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );

    let valueInput = screen.getByLabelText("Money Allocated ($ U.S.):");
    let five = screen.getByRole("button", { name: "5" });

    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    expect(valueInput).toHaveValue("$555.55");
    expect(screen.queryByText("$444.45")).toBeInTheDocument();

    fireEvent.click(five);
    expect(
      screen.queryByText(
        "Budget funds cannot exceed remaining total asset value!"
      )
    ).toBeInTheDocument();
    expect(valueInput).toHaveValue("$555.55");
    expect(screen.queryByText("$444.45")).toBeInTheDocument();
  });

  it("should call mock handle submit function when both inputs have valid values", () => {
    renderWithReduxTestStore(
      <BudgetForm
        hideForm={hideForm}
        addBudget={addBudget}
        show={true}
        mockSubmit={handleSubmit}
      />
    );

    let titleInput = screen.getByLabelText("Budget Title:");
    fireEvent.change(titleInput, {
      target: { value: "test budget" },
    });
    expect(titleInput).toHaveValue("test budget");

    fireEvent.click(screen.getByRole("button", { name: "5" }));
    expect(screen.getByLabelText("Money Allocated ($ U.S.):")).toHaveValue(
      "$0.05"
    );

    let submit = screen.getByText("Add this Budget");
    fireEvent.click(submit);
    expect(handleSubmit).toHaveBeenCalled();
    expect(addBudget).toHaveBeenCalled();
    expect(hideForm).toHaveBeenCalled();
  });

  it("should display error messages not call mock functions if form has empty/invalid inputs", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );

    fireEvent.click(screen.getByText("Add this Budget"));
    expect(
      screen.queryByText("Budget title input cannot be empty.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Budget value must be greater than $0.00.")
    ).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
    expect(addBudget).not.toHaveBeenCalled();
    expect(hideForm).not.toHaveBeenCalled();
  });

  it("should call hide form mock function and clear data when cancel button is clicked", () => {
    renderWithReduxTestStore(
      <BudgetForm hideForm={hideForm} addBudget={addBudget} show={true} />
    );

    let titleInput = screen.getByLabelText("Budget Title:");
    fireEvent.change(titleInput, {
      target: { value: "test budget" },
    });
    expect(titleInput).toHaveValue("test budget");

    let cancel = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancel);
    expect(hideForm).toHaveBeenCalled();
    expect(titleInput).toHaveValue("");
  });

  afterEach(() => {
    handleSubmit.mockClear();
    addBudget.mockClear();
    hideForm.mockClear();
  });
});
