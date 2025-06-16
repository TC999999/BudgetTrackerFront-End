import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import BudgetPageCard from "./BudgetPageCard";

describe("Single Budget Page Card", () => {
  let budget: BudgetInterface;

  beforeAll(() => {
    budget = {
      _id: "12345",
      title: "test budget",
      moneyAllocated: 500,
      moneySpent: 200,
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<BudgetPageCard budget={budget} />);
  });

  it("should show correct text", () => {
    renderWithReduxTestStore(<BudgetPageCard budget={budget} />);

    expect(screen.queryByText("test budget")).toBeInTheDocument();

    expect(
      screen.queryByText("Total Funds Allocated from Savings:")
    ).toBeInTheDocument();
    expect(screen.queryByText("$500.00")).toBeInTheDocument();

    expect(screen.queryByText("Money Spent:")).toBeInTheDocument();
    expect(screen.queryByText("$200.00")).toBeInTheDocument();

    expect(screen.queryByText("Money Remaining:")).toBeInTheDocument();
    expect(screen.queryByText("$300.00")).toBeInTheDocument();
  });
});
