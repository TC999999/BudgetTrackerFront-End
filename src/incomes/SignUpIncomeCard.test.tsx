import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import { SubmitIncomeSignUp } from "../interfaces/incomeInterfaces";
import SignUpIncomeCard from "./SignUpIncomeCard";

describe("Pre-Registration Income Card", () => {
  let income: SubmitIncomeSignUp;
  let removeIncome: Mock;

  beforeAll(() => {
    removeIncome = vi.fn();
    income = {
      title: "test income",
      salary: 500,
      cronString: "15 11 * * 5",
      readableUpdateTimeString: "11:15 a.m. on every Friday",
    };
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <SignUpIncomeCard income={income} removeIncome={removeIncome} index={1} />
    );
  });

  it("should show correct values", () => {
    renderWithRedux(
      <SignUpIncomeCard income={income} removeIncome={removeIncome} index={1} />
    );

    expect(screen.queryByText("test income")).toBeInTheDocument();
    expect(screen.queryByText("$500.00")).toBeInTheDocument();
    expect(
      screen.queryByText("11:15 a.m. on every Friday")
    ).toBeInTheDocument();
  });

  it("should call removeIncome mock function when trash button is clicked", () => {
    renderWithRedux(
      <SignUpIncomeCard income={income} removeIncome={removeIncome} index={1} />
    );

    fireEvent.click(screen.getByRole("button", { name: "delete-button" }));
    expect(removeIncome).toHaveBeenCalled();
  });
});
