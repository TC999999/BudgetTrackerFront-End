import { describe, it, expect } from "vitest";
import {
  renderWithReduxTestStore,
  renderWithReduxTestStorePageLoading,
} from "../utils/test-util";
import { screen } from "@testing-library/react";
import ListHeader from "./ListHeader";

describe("List Header", () => {
  it("should render without crashing", () => {
    renderWithReduxTestStore(<ListHeader type={"Expenses"} />);
  });

  it("should return correct messages for incomes list header", () => {
    renderWithReduxTestStore(<ListHeader type={"Incomes"} />);
    expect(screen.queryByText("All Current Incomes")).toBeInTheDocument();
  });

  it("should return correct messages for budgets list header", () => {
    renderWithReduxTestStore(<ListHeader type={"Budgets"} />);
    expect(screen.queryByText("All Current Budgets")).toBeInTheDocument();
  });

  it("should return correct messages for changes to savings list header", () => {
    renderWithReduxTestStore(<ListHeader type={"Savings"} />);
    expect(
      screen.queryByText("Full Savings Changes History")
    ).toBeInTheDocument();
  });

  it("should return correct messages for most recent changes to savings list header", () => {
    renderWithReduxTestStore(<ListHeader type={"Recent Savings"} />);
    expect(screen.queryByText("Recent Changes to Savings")).toBeInTheDocument();
  });

  it("should return correct messages for expeses list header", () => {
    renderWithReduxTestStore(<ListHeader type={"Expenses"} />);
    expect(screen.queryByText("Expenses Made")).toBeInTheDocument();
  });

  it("should return correct messages for most recent expeses list header", () => {
    renderWithReduxTestStore(<ListHeader type={"Recent Expenses"} />);
    expect(screen.queryByText("Recent Budget Expenses")).toBeInTheDocument();
  });

  it("should return max list length for budgets list", () => {
    renderWithReduxTestStore(
      <ListHeader type={"Budgets"} itemListLength={5} />
    );
    expect(screen.queryByText("(5/10)")).toBeInTheDocument();
  });

  it("should return max list length for incomes list", () => {
    renderWithReduxTestStore(
      <ListHeader type={"Incomes"} itemListLength={2} />
    );
    expect(screen.queryByText("(2/3)")).toBeInTheDocument();
  });

  it("should not return max list length for any list other than incomes or budget", () => {
    renderWithReduxTestStore(
      <ListHeader type={"Expenses"} itemListLength={5} />
    );
    expect(screen.queryByText("(5/10)")).not.toBeInTheDocument();
  });

  it("should not return max list length for budgets list when page is still loading", () => {
    renderWithReduxTestStorePageLoading(
      <ListHeader type={"Budgets"} itemListLength={5} />
    );
    expect(screen.queryByText("(5/10)")).not.toBeInTheDocument();
  });
});
