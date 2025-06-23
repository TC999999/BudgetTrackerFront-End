import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import TransactionHistory from "./transactionHistory";
import { Transaction } from "../interfaces/transactionInterfaces";

describe("Page for Full User Transaction History", () => {
  let transactions: Transaction[];

  beforeAll(() => {
    transactions = [
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
    renderWithReduxTestStore(
      <TransactionHistory transactionList={transactions} />
    );
  });

  it("should show correct header", () => {
    renderWithReduxTestStore(
      <TransactionHistory transactionList={transactions} />
    );

    expect(
      screen.queryByText("Full Savings Changes History")
    ).toBeInTheDocument();
  });

  it("should show transaction list with three transactions", () => {
    renderWithReduxTestStore(
      <TransactionHistory transactionList={transactions} />
    );

    expect(
      screen.queryByRole("list", { name: "full-transaction-list" })
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("card", { name: "transaction-card" })
    ).toHaveLength(3);
  });
});
