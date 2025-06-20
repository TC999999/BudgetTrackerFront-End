import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithReduxTestStore } from "../../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import IncomePageButtons from "./IncomePageButtons";

describe("Income Page Add Income Button", () => {
  let showIncomeFormState: Mock;

  beforeAll(() => {
    showIncomeFormState = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithReduxTestStore(
      <IncomePageButtons
        incomeListLength={1}
        showIncomeFormState={showIncomeFormState}
      />
    );
  });

  it("should have a button that calls the show form state function when clicked", () => {
    renderWithReduxTestStore(
      <IncomePageButtons
        incomeListLength={1}
        showIncomeFormState={showIncomeFormState}
      />
    );

    let button = screen.getByRole("button", { name: "Add New Income" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(showIncomeFormState).toHaveBeenCalled();
  });
});
