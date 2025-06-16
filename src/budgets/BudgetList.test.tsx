import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";
import BudgetList from "./BudgetList";

describe("Budget Page List", () => {
  let budgetList: BudgetListInterface[];

  beforeAll(() => {
    budgetList = [
      {
        _id: "12345",
        title: "test budget 1",
        moneyAllocated: 1000,
        moneyRemaining: 600,
        moneySpent: 400,
      },
      {
        _id: "23456",
        title: "test budget 2",
        moneyAllocated: 200,
        moneyRemaining: 200,
        moneySpent: 0,
      },
      {
        _id: "34567",
        title: "test budget 3",
        moneyAllocated: 500,
        moneyRemaining: 0,
        moneySpent: 500,
      },
    ];
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<BudgetList allBudgets={budgetList} />);
  });

  it("should show three cards (equal number to list of budgets)", () => {
    renderWithReduxTestStore(<BudgetList allBudgets={budgetList} />);
    expect(screen.getAllByText("Total Funds Allocated:")).toHaveLength(3);
  });

  it("should show correct text for card 1", () => {
    renderWithReduxTestStore(<BudgetList allBudgets={budgetList} />);
    let card1 = screen.getAllByRole("card", { name: "budget-card" })[0];
    expect(card1).toHaveTextContent("test budget 1");
    expect(card1).toHaveTextContent("$1,000.00");
    expect(card1).toHaveTextContent("$400.00");
    expect(card1).toHaveTextContent("$600.00");
  });

  it("should show correct text for card 2", () => {
    renderWithReduxTestStore(<BudgetList allBudgets={budgetList} />);
    let card2 = screen.getAllByRole("card", { name: "budget-card" })[1];
    expect(card2).toHaveTextContent("test budget 2");
    expect(card2).toHaveTextContent("$200.00");
    expect(card2).toHaveTextContent("$200.00");
    expect(card2).toHaveTextContent("$0.00");
  });

  it("should show correct text for card 2", () => {
    renderWithReduxTestStore(<BudgetList allBudgets={budgetList} />);
    let card3 = screen.getAllByRole("card", { name: "budget-card" })[2];
    expect(card3).toHaveTextContent("test budget 3");
    expect(card3).toHaveTextContent("$500.00");
    expect(card3).toHaveTextContent("$0.00");
    expect(card3).toHaveTextContent("$500.00");
  });
});
