import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import UpdateIncomeForm from "./UpdateIncomeForm";
import { Income } from "../interfaces/incomeInterfaces";

describe("Update Income Form", () => {
  let income: Income;
  let unselectIncome: Mock;
  let updateIncomeState: Mock;
  let mockSubmit: Mock;

  beforeAll(() => {
    income = {
      _id: "12345",
      title: "test income",
      salary: 500,
      cronString: "15 11 * * 5",
      readableUpdateTimeString: "11:15 a.m. on every Friday",
      nextReceived: "2025-06-27T15:15:00.000Z",
      lastReceived: "2025-06-20T15:15:00.000Z",
    };
    unselectIncome = vi.fn();

    updateIncomeState = vi.fn();
    mockSubmit = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );
  });

  it("should show correct initial headers for existing income", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    expect(screen.queryByText("Update test income Income")).toBeInTheDocument();

    expect(
      screen.queryByText("11:15 a.m. on every Friday")
    ).toBeInTheDocument();
  });

  it("should show correct initial title data for existing income and allow user to change title input", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    let titleInput = screen.getByLabelText("Income Title:");

    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toContainHTML("test income");
    expect(titleInput).toHaveValue("test income");

    fireEvent.change(titleInput, { target: { value: "new test income" } });
    expect(titleInput).toContainHTML("new test income");
    expect(titleInput).toHaveValue("new test income");
  });

  it("should show correct initial value data for existing income and allow user to change value input with keypad", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    let valueInput = screen.getByLabelText("Income Value ($ U.S.):");

    expect(valueInput).toBeInTheDocument();
    expect(valueInput).toContainHTML("$500.00");
    expect(valueInput).toHaveValue("$500.00");

    fireEvent.click(screen.getByText("Delete"));
    expect(valueInput).toContainHTML("$50.00");
    expect(valueInput).toHaveValue("$50.00");
  });

  it("should show default hour select", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    let hourInput = screen.getByLabelText("Hour:");
    expect(hourInput).toBeInTheDocument();
    expect(hourInput).toHaveValue("11");
  });

  it("should show default minute select", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    let minuteInput = screen.getByLabelText("Minute:");
    expect(minuteInput).toBeInTheDocument();
    expect(minuteInput).toHaveValue("15");
  });

  it("should show default day of month select", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    let dayOfMonthInput = screen.getByLabelText("Day:");
    expect(dayOfMonthInput).toBeInTheDocument();
    expect(dayOfMonthInput).toHaveValue("*");
  });

  it("should not initially show month select", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    let monthInput = screen.queryByLabelText("Month:");
    expect(monthInput).not.toBeInTheDocument();
  });

  it("should show default day of the week select", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    let weekInput = screen.queryByLabelText("Day of Week:");
    expect(weekInput).toBeInTheDocument();
    expect(weekInput).toHaveValue("5");
  });

  it("should call hide form function when cancel button is clicked", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(unselectIncome).toHaveBeenCalled();
    unselectIncome.mockClear();
  });

  it("should call hide form function and mock submit function when submit button is clicked", () => {
    renderWithReduxTestStore(
      <UpdateIncomeForm
        income={income}
        unselectIncome={unselectIncome}
        updateIncomeState={updateIncomeState}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    fireEvent.click(screen.getByText("Update Income"));
    expect(mockSubmit).toHaveBeenCalled();
    mockSubmit.mockClear();
  });
});
