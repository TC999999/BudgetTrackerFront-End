import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import { Income } from "../interfaces/incomeInterfaces";
import IncomeCard from "./IncomeCard";

describe("Income List Card", () => {
  let showSecondPrompt: Mock;
  let selectIncome: Mock;
  let income: Income;

  beforeAll(() => {
    showSecondPrompt = vi.fn();
    selectIncome = vi.fn();

    income = {
      _id: "12345",
      title: "test income",
      salary: 500,
      cronString: "15 11 * * 5",
      readableUpdateTimeString: "11:15 a.m. on every Friday",
      nextReceived: "2025-06-27T15:15:00.000Z",
      lastReceived: "2025-06-20T15:15:00.000Z",
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <IncomeCard
        income={income}
        showSecondPrompt={showSecondPrompt}
        selectIncome={selectIncome}
      />
    );
  });

  it("should show correct data", () => {
    renderWithReduxTestStore(
      <IncomeCard
        income={income}
        showSecondPrompt={showSecondPrompt}
        selectIncome={selectIncome}
      />
    );

    expect(screen.queryByText("test income")).toBeInTheDocument();

    expect(screen.queryByText("Salary:")).toBeInTheDocument();
    expect(screen.queryByText("$500.00")).toBeInTheDocument();
    expect(
      screen.queryByText("11:15 a.m. on every Friday")
    ).toBeInTheDocument();

    expect(screen.queryByText("Last Received:")).toBeInTheDocument();
    expect(screen.queryByText("Jun 20, 2025 at 11:15 AM")).toBeInTheDocument();

    expect(screen.queryByText("Next Received:")).toBeInTheDocument();
    expect(screen.queryByText("Jun 27, 2025 at 11:15 AM")).toBeInTheDocument();
  });

  it("should have a 'Delete Income' button that calls show second prompt mock function", () => {
    renderWithReduxTestStore(
      <IncomeCard
        income={income}
        showSecondPrompt={showSecondPrompt}
        selectIncome={selectIncome}
      />
    );

    let button = screen.getByRole("button", { name: "Delete Income" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(showSecondPrompt).toHaveBeenCalled();
    expect(selectIncome).not.toHaveBeenCalled();
    showSecondPrompt.mockClear();
  });

  it("should have a 'Delete Income' button that calls show second prompt mock function", () => {
    renderWithReduxTestStore(
      <IncomeCard
        income={income}
        showSecondPrompt={showSecondPrompt}
        selectIncome={selectIncome}
      />
    );

    let button = screen.getByRole("button", { name: "Update Income" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(showSecondPrompt).not.toHaveBeenCalled();
    expect(selectIncome).toHaveBeenCalled();
    selectIncome.mockClear();
  });
});
