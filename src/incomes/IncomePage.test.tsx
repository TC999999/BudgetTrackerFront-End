import { describe, it, expect, beforeAll } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import IncomePage from "./IncomePage";
import { Income } from "../interfaces/incomeInterfaces";

describe("Income List Page", () => {
  let incomeList: Income[];

  beforeAll(() => {
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
    renderWithReduxTestStore(<IncomePage incomeList={incomeList} />);
  });

  it("should show correct list header", () => {
    renderWithReduxTestStore(<IncomePage incomeList={incomeList} />);

    expect(screen.queryByText("All Current Incomes")).toBeInTheDocument();
    expect(screen.queryByText("(3/3)")).toBeInTheDocument();
  });

  it("should show form when 'Add New Income' button is clicked and hide form 'Cancel'", async () => {
    renderWithReduxTestStore(<IncomePage incomeList={incomeList} />);

    expect(screen.queryByText("Add A New Income")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Add New Income"));

    expect(screen.queryByText("Add A New Income")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(screen.queryByText("Add A New Income")).not.toBeInTheDocument();
    });
    expect(screen.queryByText("Add A New Income")).not.toBeInTheDocument();
  });

  it("show list of three cards with income info", async () => {
    renderWithReduxTestStore(<IncomePage incomeList={incomeList} />);

    expect(
      screen.getAllByRole("card", { name: "income-list-card" })
    ).toHaveLength(3);
  });

  it("show update income form if one of the buttons labelled 'Update Income' is clicked", async () => {
    renderWithReduxTestStore(<IncomePage incomeList={incomeList} />);

    let buttons = screen.getAllByText("Update Income");
    expect(buttons).toHaveLength(3);

    expect(
      screen.queryByText("Update test income 1 Income")
    ).not.toBeInTheDocument();

    fireEvent.click(buttons[0]);

    expect(
      screen.queryByText("Update test income 1 Income")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("Update test income 1 Income")
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByText("Update test income 1 Income")
    ).not.toBeInTheDocument();
  });

  it("show delete income prompt if one of the buttons labelled 'Delete Income' is clicked", async () => {
    renderWithReduxTestStore(<IncomePage incomeList={incomeList} />);

    let buttons = screen.getAllByText("Delete Income");
    expect(buttons).toHaveLength(3);

    expect(
      screen.queryByText("Are You Sure You Want To Delete This Income?")
    ).not.toBeInTheDocument();

    fireEvent.click(buttons[0]);

    expect(
      screen.queryByText("Are You Sure You Want To Delete This Income?")
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));

    await waitFor(() => {
      expect(
        screen.queryByText("Are You Sure You Want To Delete This Income?")
      ).not.toBeInTheDocument();
    });

    expect(
      screen.queryByText("Are You Sure You Want To Delete This Income?")
    ).not.toBeInTheDocument();
  });
});
