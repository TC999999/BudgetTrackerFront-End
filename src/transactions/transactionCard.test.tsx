import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import TransactionCard from "./transactionCard";
import { Transaction } from "../interfaces/transactionInterfaces";

describe("TransactionCard", () => {
  let t1: Transaction;
  let t2: Transaction;
  let t3: Transaction;

  beforeAll(() => {
    t3 = {
      _id: "3",
      date: "2025-05-22T19:04:00.000+00:00",
      fromIncome: false,
      operation: "subtract",
      title: "test transaction",
      transaction: 1000,
      budgetOperation: "-",
      newBalance: 3000,
    };
    t2 = {
      _id: "2",
      date: "2025-05-22T19:03:00.000+00:00",
      fromIncome: false,
      operation: "subtract",
      title: "test budget",
      transaction: 1000,
      budgetOperation: "Created",
      newBalance: 4000,
    };
    t1 = {
      _id: "1",
      date: "2025-05-22T19:02:00.000+00:00",
      fromIncome: true,
      operation: "add",
      title: "test income",
      transaction: 1000,
      budgetOperation: "-",
      newBalance: 5000,
    };
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(<TransactionCard transaction={t1} />);
  });

  it("should show correct converted values for values and dates for received income", () => {
    renderWithReduxTestStore(<TransactionCard transaction={t1} />);

    expect(screen.queryByText("test income")).toBeInTheDocument();
    expect(screen.queryByText("May 22, 2025")).toBeInTheDocument();
    expect(screen.queryByText("03:02 PM")).toBeInTheDocument();
    expect(screen.queryByText("+$1,000.00")).toBeInTheDocument();
    expect(screen.queryByText("$5,000.00")).toBeInTheDocument();

    expect(screen.queryByText("test budget")).not.toBeInTheDocument();
    expect(screen.queryByText("test transaction")).not.toBeInTheDocument();
  });

  it("should show correct converted values for values and dates for budget changes", () => {
    renderWithReduxTestStore(<TransactionCard transaction={t2} />);

    expect(screen.queryByText("test budget")).toBeInTheDocument();
    expect(screen.queryByText("May 22, 2025")).toBeInTheDocument();
    expect(screen.queryByText("03:03 PM")).toBeInTheDocument();
    expect(screen.queryByText("-$1,000.00")).toBeInTheDocument();
    expect(screen.queryByText("$4,000.00")).toBeInTheDocument();
    expect(screen.queryByText("Created")).toBeInTheDocument();

    expect(screen.queryByText("test income")).not.toBeInTheDocument();
    expect(screen.queryByText("test transaction")).not.toBeInTheDocument();
  });

  it("should show correct converted values for values and dates for normal transaction", () => {
    renderWithReduxTestStore(<TransactionCard transaction={t3} />);

    expect(screen.queryByText("test transaction")).toBeInTheDocument();
    expect(screen.queryByText("May 22, 2025")).toBeInTheDocument();
    expect(screen.queryByText("03:04 PM")).toBeInTheDocument();
    expect(screen.queryByText("-$1,000.00")).toBeInTheDocument();
    expect(screen.queryByText("$3,000.00")).toBeInTheDocument();
    expect(screen.queryByText("Created")).not.toBeInTheDocument();

    expect(screen.queryByText("test budget")).not.toBeInTheDocument();
    expect(screen.queryByText("test income")).not.toBeInTheDocument();
  });
});
