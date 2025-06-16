import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";
import BudgetCard from "./BudgetCard";

describe("Budget List Card", () => {
  let b: BudgetListInterface;

  beforeAll(() => {
    b = {
      _id: "12345",
      title: "test budget",
      moneyAllocated: 1000,
      moneyRemaining: 600,
      moneySpent: 400,
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<BudgetCard budget={b} />);
  });

  it("should show correct text", () => {
    renderWithReduxTestStore(<BudgetCard budget={b} />);
    expect(screen.queryByText("test budget")).toBeInTheDocument();
    expect(screen.queryByText("Total Funds Allocated:")).toBeInTheDocument();
    expect(screen.queryByText("$1,000.00")).toBeInTheDocument();
    expect(screen.queryAllByText("Funds")).toHaveLength(2);
    expect(screen.queryByText("Spent:")).toBeInTheDocument();
    expect(screen.queryByText("$400.00")).toBeInTheDocument();
    expect(screen.queryByText("Remaining:")).toBeInTheDocument();
    expect(screen.queryByText("$600.00")).toBeInTheDocument();
  });
});
