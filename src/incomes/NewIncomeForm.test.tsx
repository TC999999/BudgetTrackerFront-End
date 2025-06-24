import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import NewIncomeForm from "./NewIncomeForm";

describe("New Income Form", () => {
  let hideIncomeFormState: Mock;
  let addToIncomeState: Mock;
  let mockSubmit: Mock;

  beforeAll(() => {
    hideIncomeFormState = vi.fn();
    addToIncomeState = vi.fn();
    mockSubmit = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );
  });

  it("should show correct headers for new income", () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    expect(screen.queryByText("Add A New Income")).toBeInTheDocument();
    expect(
      screen.queryByText("Midnight on every day of the year")
    ).toBeInTheDocument();
  });

  it("should show default title input and user should be able to change title input", () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let titleInput = screen.getByLabelText("Income Title:");

    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toContainHTML("");
    fireEvent.change(titleInput, { target: { value: "test new income" } });
    expect(titleInput).toContainHTML("test new income");
  });

  it("should show error message if invalid title is inputted", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let titleInput = screen.getByLabelText("Income Title:");

    fireEvent.change(titleInput, { target: { value: "t&est new inc()ome" } });
    expect(titleInput).toContainHTML("t&est new inc()ome");

    expect(
      screen.queryByText("Income title input contains invalid characters.")
    ).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: "hi" } });
    expect(
      screen.queryByText("Income title must be greater than 3 characters.")
    ).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: "" } });
    expect(
      screen.queryByText("Income title input cannot be empty.")
    ).toBeInTheDocument();
  });

  it("should show default salary input and user should be able to change salary input with keypad", () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let valueInput = screen.getByLabelText("Income Value ($ U.S.):");
    expect(valueInput).toBeInTheDocument();
    expect(valueInput).toContainHTML("$0.00");

    let five = screen.getByRole("button", { name: "5" });
    fireEvent.click(five);
    expect(valueInput).toContainHTML("$0.05");
    fireEvent.click(five);
    fireEvent.click(five);
    expect(valueInput).toContainHTML("$5.55");

    fireEvent.click(screen.getByText("Delete"));
    expect(valueInput).toContainHTML("$0.55");
  });

  it("should show default hour select, hour select should have 24 options, and user should be able to change hour to any given value", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let hourInput = screen.getByLabelText("Hour:");
    expect(hourInput).toBeInTheDocument();
    expect(hourInput).toHaveValue("0");

    let options = screen.getAllByRole("option", { name: "hour-option" });
    expect(options).toHaveLength(24);

    fireEvent.change(hourInput, { target: { value: "12" } });
    expect(hourInput).toHaveValue("12");

    fireEvent.change(hourInput, { target: { value: "23" } });
    expect(hourInput).toHaveValue("23");

    fireEvent.change(hourInput, { target: { value: "24" } });
    expect(hourInput).toHaveValue("0");
  });

  it("should show default minute select, hour select should have 60 options, and user should be able to change hour to any given value", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let minuteInput = screen.getByLabelText("Minute:");
    expect(minuteInput).toBeInTheDocument();
    expect(minuteInput).toHaveValue("0");

    let options = screen.getAllByRole("option", { name: "minute-option" });
    expect(options).toHaveLength(60);

    fireEvent.change(minuteInput, { target: { value: "30" } });
    expect(minuteInput).toHaveValue("30");

    fireEvent.change(minuteInput, { target: { value: "59" } });
    expect(minuteInput).toHaveValue("59");

    fireEvent.change(minuteInput, { target: { value: "60" } });
    expect(minuteInput).toHaveValue("0");
  });

  it("should show default day of the month select, which should initially have 31 options, and user should be able to change it to any given value", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let dayInput = screen.getByLabelText("Day:");
    expect(dayInput).toBeInTheDocument();
    expect(dayInput).toHaveValue("*");

    let options = screen.getAllByRole("option", {
      name: "day-of-month-option",
    });
    expect(options).toHaveLength(32);

    fireEvent.change(dayInput, { target: { value: "15" } });
    expect(dayInput).toHaveValue("15");

    fireEvent.change(dayInput, { target: { value: "31" } });
    expect(dayInput).toHaveValue("31");

    fireEvent.change(dayInput, { target: { value: "32" } });
    expect(dayInput).toHaveValue("*");
  });

  it("should show default month select when day has been selected, which should have 13 options, and user should be able to change it to any given value", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    screen.queryByLabelText("Month:");
    expect(screen.queryByLabelText("Month:")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Day:"), {
      target: { value: "15" },
    });

    let monthInput = screen.getByLabelText("Month:");
    expect(monthInput).toBeInTheDocument();
    expect(monthInput).toHaveValue("*");

    let options = screen.getAllByRole("option", {
      name: "month-option",
    });
    expect(options).toHaveLength(13);

    fireEvent.change(monthInput, { target: { value: "6" } });
    expect(monthInput).toHaveValue("6");

    fireEvent.change(monthInput, { target: { value: "12" } });
    expect(monthInput).toHaveValue("12");

    fireEvent.change(monthInput, { target: { value: "13" } });
    expect(monthInput).toHaveValue("*");
  });

  it("should change day of month options length based on selected month", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let dayInput = screen.getByLabelText("Day:");
    fireEvent.change(dayInput, { target: { value: "15" } });
    let monthInput = screen.getByLabelText("Month:");

    fireEvent.change(monthInput, { target: { value: "1" } });
    expect(
      screen.getAllByRole("option", {
        name: "day-of-month-option",
      })
    ).toHaveLength(32);

    fireEvent.change(monthInput, { target: { value: "2" } });
    expect(
      screen.getAllByRole("option", {
        name: "day-of-month-option",
      })
    ).toHaveLength(30);

    fireEvent.change(monthInput, { target: { value: "4" } });
    expect(
      screen.getAllByRole("option", {
        name: "day-of-month-option",
      })
    ).toHaveLength(31);
  });

  it("should show default day of week select, which should have 8 options, and user should be able to change it to any given value", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );

    let dayOfWeekInput = screen.getByLabelText("Day of Week:");
    expect(dayOfWeekInput).toBeInTheDocument();
    expect(dayOfWeekInput).toHaveValue("*");

    let options = screen.getAllByRole("option", {
      name: "day-of-week-option",
    });
    expect(options).toHaveLength(8);

    fireEvent.change(dayOfWeekInput, { target: { value: "3" } });
    expect(dayOfWeekInput).toHaveValue("3");

    fireEvent.change(dayOfWeekInput, { target: { value: "6" } });
    expect(dayOfWeekInput).toHaveValue("6");

    fireEvent.change(dayOfWeekInput, { target: { value: "7" } });
    expect(dayOfWeekInput).toHaveValue("*");
  });

  it("should call hide form function when cancel button is clicked", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
      />
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(hideIncomeFormState).toHaveBeenCalled();
    hideIncomeFormState.mockClear();
  });

  it("should not call mocksubmit and hideform functions when submit button is clicked with no information inputted", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
        mockSubmit={mockSubmit}
      />
    );
    fireEvent.click(screen.getByText("Add Income"));
    expect(mockSubmit).not.toHaveBeenCalled();
    expect(hideIncomeFormState).not.toHaveBeenCalled();
  });

  it("should call mocksubmit and hideform functions when submit button is clicked with information inputted", async () => {
    renderWithReduxTestStore(
      <NewIncomeForm
        hideIncomeFormState={hideIncomeFormState}
        addToIncomeState={addToIncomeState}
        show={true}
        mockSubmit={mockSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText("Income Title:"), {
      target: { value: "test new income" },
    });
    fireEvent.click(screen.getByRole("button", { name: "5" }));

    fireEvent.click(screen.getByText("Add Income"));
    expect(mockSubmit).toHaveBeenCalled();
    expect(hideIncomeFormState).toHaveBeenCalled();
    mockSubmit.mockClear();
    hideIncomeFormState.mockClear();
  });
});
