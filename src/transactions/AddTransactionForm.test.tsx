import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import AddTransactionForm from "./AddTransactionForm";
import { DateTime } from "luxon";

describe("AddTransactionForm", () => {
  let updateTransactions: Mock;
  let hideForm: Mock;

  beforeAll(() => {
    updateTransactions = vi.fn();
    hideForm = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );
  });

  it("should show the correct value for total assets in redux", () => {
    renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );
    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();
  });

  it("should show nothing when show boolean is false", () => {
    renderWithReduxTestStore(
      <AddTransactionForm
        show={false}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );
    expect(screen.queryByText("$1,000.00")).not.toBeInTheDocument();
  });

  it("should have correct inputs (title, value, date)", () => {
    const { container } = renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );
    expect(container.querySelector("#title")).toBeInTheDocument();
    expect(container.querySelector("#date")).toBeInTheDocument();
    expect(container.querySelector("#addedAssets")).toBeInTheDocument();
    expect(container.querySelector("#name")).not.toBeInTheDocument();
  });

  it("should enter transaction title", () => {
    renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );
    const title_input = screen.getByPlaceholderText(
      "What is the reason for this transaction?"
    );
    expect(title_input).toContainHTML("");
    fireEvent.change(title_input, { target: { value: "test transaction" } });
    expect(title_input).toContainHTML("test transaction");
  });

  it("should not be able to change date", () => {
    renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );
    let setDate = DateTime.now().toFormat("yyyy-MM-dd'T'T");
    expect(screen.getByLabelText("Transaction Date")).toHaveValue(setDate);
    let newDate = DateTime.local(2025, 1, 1, 15, 30, 0, 0).toFormat(
      "yyyy-MM-dd'T'T"
    );
    fireEvent.change(screen.getByLabelText("Transaction Date"), {
      target: { value: newDate },
    });
    expect(screen.getByLabelText("Transaction Date")).not.toHaveValue(newDate);
    expect(screen.getByLabelText("Transaction Date")).toHaveValue(setDate);
  });

  it("should be able to change transaction value", () => {
    renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );
    let val = screen.getByLabelText(
      "What is the value of this transaction? ($ U.S.):"
    );

    expect(val).toContainHTML("$0.00");
    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();
    let five = screen.getByRole("button", { name: "5" });
    expect(five).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    fireEvent.click(five);
    expect(val).toContainHTML("$0.05");
    expect(screen.queryByText("$1,000.05")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).toBeInTheDocument();

    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);
    expect(val).toContainHTML("$55.55");
    expect(screen.queryByText("$1,055.55")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(val).toContainHTML("$5.55");
    expect(screen.queryByText("$1,005.55")).toBeInTheDocument();
  });

  it("should show errors when attempting to submit a form with empty inputs", () => {
    renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
      />
    );

    expect(
      screen.queryByText("Transaction title input cannot be empty.")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Transaction value must be greater than $0.00.")
    ).not.toBeInTheDocument();

    let submit = screen.getByRole("button", { name: "Add this Transaction" });
    expect(submit).toBeInTheDocument();
    fireEvent.click(submit);
    expect(
      screen.queryByText("Transaction title input cannot be empty.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Transaction value must be greater than $0.00.")
    ).toBeInTheDocument();
  });

  it("should call handlesubmit function when submit button is clicked", () => {
    const handleSubmit = vi.fn();
    renderWithReduxTestStore(
      <AddTransactionForm
        show={true}
        updateTransactions={updateTransactions}
        hideForm={hideForm}
        submit={handleSubmit}
      />
    );
    let submit = screen.getByRole("button", { name: "Add this Transaction" });
    fireEvent.click(submit);
    expect(handleSubmit).toHaveBeenCalled();
  });
});
