import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import IncomeList from "./IncomeList";
import { Income } from "../interfaces/incomeInterfaces";

describe("Income List", () => {
  let incomeList: Income[];
  let removeFromIncomeState: Mock;
  let updateIncomeState: Mock;

  beforeAll(() => {
    removeFromIncomeState = vi.fn();
    updateIncomeState = vi.fn();
    incomeList = [
      {
        _id: "1",
        title: "test income 1",
        salary: 1000,
        cronString: "0 5 20 * *",
        readableUpdateTimeString: "05:00 p.m. on the 20th day of every month",
        lastReceived: "2025-06-20T05:00:00.000Z",
        nextReceived: "2025-07-20T05:00:00.000Z",
      },
      {
        _id: "2",
        title: "test income 2",
        salary: 75000,
        cronString: "0 12 3 4 *",
        readableUpdateTimeString: "Noon on the 3rd day of April every year",
        lastReceived: "2025-04-03T12:00:00.000Z",
        nextReceived: "2026-04-03T12:00:00.000Z",
      },
      {
        _id: "3",
        title: "test income 3",
        salary: 250,
        cronString: "30 12 * * 5",
        readableUpdateTimeString: "12:30 p.m. on every Friday",
        lastReceived: "2025-06-20T12:30:00.000Z",
        nextReceived: "2025-06-27T12:30:00.000Z",
      },
    ];
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <IncomeList
        incomeList={incomeList}
        removeFromIncomeState={removeFromIncomeState}
        updateIncomeState={updateIncomeState}
      />
    );
  });

  it("should have three cards in list", () => {
    renderWithReduxTestStore(
      <IncomeList
        incomeList={incomeList}
        removeFromIncomeState={removeFromIncomeState}
        updateIncomeState={updateIncomeState}
      />
    );

    expect(
      screen.getAllByRole("card", { name: "income-list-card" })
    ).toHaveLength(3);
  });

  it("should show message if income list is empty", () => {
    renderWithReduxTestStore(
      <IncomeList
        incomeList={[]}
        removeFromIncomeState={removeFromIncomeState}
        updateIncomeState={updateIncomeState}
      />
    );

    expect(
      screen.queryByText("You currently have no incomes")
    ).toBeInTheDocument();
  });

  it("should show update form for a single income when when update button on one card is clicked", async () => {
    renderWithReduxTestStore(
      <IncomeList
        incomeList={incomeList}
        removeFromIncomeState={removeFromIncomeState}
        updateIncomeState={updateIncomeState}
      />
    );

    expect(
      screen.queryByRole("form-modal", { name: "income-form" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Update Income")[0]);

    expect(
      screen.queryByRole("form-modal", { name: "income-form" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByRole("form-modal", { name: "income-form" })
      ).not.toBeInTheDocument();
    });
  });

  it("should show update form for a single income when when update button on one card is clicked", async () => {
    renderWithReduxTestStore(
      <IncomeList
        incomeList={incomeList}
        removeFromIncomeState={removeFromIncomeState}
        updateIncomeState={updateIncomeState}
      />
    );

    expect(
      screen.queryByRole("form-modal", { name: "second-prompt" })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByText("Delete Income")[0]);

    expect(
      screen.queryByRole("form-modal", { name: "second-prompt" })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByRole("form-modal", { name: "second-prompt" })
      ).not.toBeInTheDocument();
    });
  });
});
