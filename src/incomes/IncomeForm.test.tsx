import { describe, it, expect, beforeAll, Mock, vi, afterEach } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen } from "@testing-library/react";
import userEvent, { UserEvent } from "@testing-library/user-event";

import {
  NewIncome,
  IncomeErrors,
  FlashIncomeErrors,
} from "../interfaces/incomeInterfaces";
import IncomeForm from "./IncomeForm";

describe("Base Income Form", () => {
  let formData: NewIncome;
  let formErrors: IncomeErrors;
  let flashErrors: FlashIncomeErrors;
  let handleChange: Mock;
  let handlePress: Mock;
  let handleDelete: Mock;
  let handleTime: Mock;
  let handleDate: Mock;
  let handleMonth: Mock;
  let handleWeek: Mock;
  let handleSubmit: Mock;
  let hide: Mock;
  let user: UserEvent;

  beforeAll(async () => {
    formData = {
      title: "",
      salary: 0,
      updateTime: {
        minute: "0",
        hour: "0",
        dayOfMonth: "*",
        month: "*",
        dayOfWeek: "*",
      },
    };
    formErrors = { title: "", salary: "" };
    flashErrors = { title: false, salary: false };
    handleChange = vi.fn();
    handlePress = vi.fn();
    handleDelete = vi.fn();
    handleTime = vi.fn();
    handleDate = vi.fn();
    handleMonth = vi.fn();
    handleWeek = vi.fn();
    handleSubmit = vi.fn();
    hide = vi.fn();

    user = userEvent.setup();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <IncomeForm
        type="New"
        formData={formData}
        formErrors={formErrors}
        flashErrors={flashErrors}
        readableUpdateTimeString="Midnight on every day of the year"
        show={true}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        handleTime={handleTime}
        handleDate={handleDate}
        handleMonth={handleMonth}
        handleWeek={handleWeek}
        handleSubmit={handleSubmit}
        hide={hide}
      />
    );
  });

  it("should call handleChange when user changes title input", async () => {
    renderWithReduxTestStore(
      <IncomeForm
        type="New"
        formData={formData}
        formErrors={formErrors}
        flashErrors={flashErrors}
        readableUpdateTimeString="Midnight on every day of the year"
        show={true}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        handleTime={handleTime}
        handleDate={handleDate}
        handleMonth={handleMonth}
        handleWeek={handleWeek}
        handleSubmit={handleSubmit}
        hide={hide}
      />
    );

    let titleInput = screen.getByLabelText("Income Title:");

    await userEvent.type(titleInput, "test");
    expect(handleChange).toHaveBeenCalled();
  });

  afterEach(() => {
    handleChange.mockClear();
    handlePress.mockClear();
    handleDelete.mockClear();
    handleTime.mockClear();
    handleDate.mockClear();
    handleMonth.mockClear();
    handleWeek.mockClear();
    handleSubmit.mockClear();
    hide.mockClear();
  });
});
