import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import SignUpAdditional from "./SignUpAdditional";
import { SignUpInterface } from "../interfaces/authInterfaces";

describe("Optional Registration Information Form", () => {
  let initialState: SignUpInterface;
  let changeLoading: Mock;
  let changeSubmitError: Mock;

  beforeAll(() => {
    initialState = {
      username: "testUsername",
      password: "testpassword123!!!",
      totalAssets: 0,
      email: "testemail@gmail.com",
      incomes: [],
      trusted: true,
    };
    changeLoading = vi.fn();
    changeSubmitError = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
  });

  it("should show correct headers", () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(screen.queryByText("Additional Information")).toBeInTheDocument();
    expect(
      screen.queryByText(
        "(None of the below information is required. You will be allowed to add or remove values after registration.)"
      )
    ).toBeInTheDocument();
  });

  it("should have a total assets input, an income button, and a checkbox", () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(
      screen.getByLabelText("Total Assets: ($ U.S.):")
    ).toBeInTheDocument();
    expect(screen.getByText("Add an Income")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("should be able to change total assets input using keypad", () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    let savings = screen.getByLabelText("Total Assets: ($ U.S.):");
    expect(savings).toContainHTML("$0.00");
    expect(savings).toHaveValue("$0.00");

    let five = screen.getByText("5");
    fireEvent.click(five);

    expect(savings).toContainHTML("$0.05");
    expect(savings).toHaveValue("$0.05");

    fireEvent.click(five);
    fireEvent.click(five);
    fireEvent.click(five);

    expect(savings).toContainHTML("$55.55");
    expect(savings).toHaveValue("$55.55");

    fireEvent.click(screen.getByText("Delete"));

    expect(savings).toContainHTML("$5.55");
    expect(savings).toHaveValue("$5.55");
  });

  it("should show new income form when 'Add an Income' button is clicked", () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
    expect(screen.queryByText("Add A New Income")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("Add an Income"));
    expect(screen.queryByText("Add A New Income")).toBeInTheDocument();
  });

  it("should show new income card after submitting new income using form", async () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(screen.queryByText("No Incomes")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Add an Income"));

    fireEvent.change(screen.getByLabelText("Income Title:"), {
      target: { value: "test title" },
    });

    fireEvent.click(screen.getAllByText("5")[0]);
    fireEvent.click(screen.getByText("Add Income"));

    await waitFor(() => {
      expect(screen.queryByText("Add A New Income")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("No Incomes")).not.toBeInTheDocument();
    let card = screen.getByRole("card", { name: "submit-income-card" });
    expect(card).toBeInTheDocument();
    expect(card).toContainHTML("test title");
    expect(card).toContainHTML("<b>Value:</b> $0.05");
    expect(card).toContainHTML(
      "<b>Received at:</b> Midnight on every day of the year"
    );
  });

  it("should be able to delete new incomes after they are added to list", () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={{
          ...initialState,
          incomes: [
            {
              title: "test income",
              salary: 500,
              cronString: "15 11 * * 5",
              readableUpdateTimeString: "11:15 a.m. on every Friday",
            },
          ],
        }}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );

    expect(screen.queryByText("No Incomes")).not.toBeInTheDocument();
    let card = screen.getByRole("card", { name: "submit-income-card" });
    expect(card).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "delete-button" }));
    expect(screen.queryByText("No Incomes")).toBeInTheDocument();
    expect(card).not.toBeInTheDocument();
  });

  it("should be able to change trusted state after clicking checkbox", () => {
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
      />
    );
    let checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("should call submit function when 'Sign Up!' button is clicked", () => {
    let mockSubmit: Mock = vi.fn();
    renderWithRedux(
      <SignUpAdditional
        initialState={initialState}
        changeLoading={changeLoading}
        changeSubmitError={changeSubmitError}
        show={true}
        mockSubmit={mockSubmit}
      />
    );
    fireEvent.click(screen.getByText("Sign Up!"));
    expect(changeLoading).toHaveBeenCalled();
    expect(mockSubmit).toHaveBeenCalled();
  });

  afterEach(() => {
    changeLoading.mockClear();
    changeSubmitError.mockClear();
  });
});
