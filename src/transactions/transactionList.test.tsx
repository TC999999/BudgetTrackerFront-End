import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import TransactionList from "./transactionList";
import { Transaction } from "../interfaces/transactionInterfaces";

describe("List of changes to savings", () => {
  let tList: Transaction[];

  beforeAll(() => {
    tList = [
      {
        _id: "3",
        date: "2025-05-22T19:04:00.000+00:00",
        fromIncome: false,
        operation: "subtract",
        title: "test transaction",
        transaction: 1000,
        budgetOperation: "-",
        newBalance: 3000,
      },
      {
        _id: "2",
        date: "2025-05-22T19:03:00.000+00:00",
        fromIncome: false,
        operation: "subtract",
        title: "test budget",
        transaction: 1000,
        budgetOperation: "Created",
        newBalance: 4000,
      },
      {
        _id: "1",
        date: "2025-05-22T19:02:00.000+00:00",
        fromIncome: true,
        operation: "add",
        title: "test income",
        transaction: 1000,
        budgetOperation: "-",
        newBalance: 5000,
      },
    ];
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<TransactionList transactions={tList} />);
  });

  it("should have all three titles", () => {
    renderWithReduxTestStore(<TransactionList transactions={tList} />);
    expect(screen.queryByText("test transaction")).toBeInTheDocument();
    expect(screen.queryByText("test budget")).toBeInTheDocument();
    expect(screen.queryByText("test income")).toBeInTheDocument();
  });
});
