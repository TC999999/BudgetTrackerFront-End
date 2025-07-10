import { describe, it, expect, vi, Mock, beforeAll, afterEach } from "vitest";
import { renderWithRedux } from "../../utils/test-util";
import { fireEvent, screen } from "@testing-library/react";
import SignUpAdditionalForm from "./SignUpAdditionalForm";
import { SignUpInterface } from "../interfaces/authInterfaces";

describe("Form Component for Additional Registration Information", () => {
  let formData: SignUpInterface;
  let showIncomeFormState: Mock;
  let handleChange: Mock;
  let handlePress: Mock;
  let handleDelete: Mock;
  let removeIncome: Mock;
  let handleCheckBox: Mock;
  let handleSubmit: Mock;

  beforeAll(() => {
    formData = {
      username: "testUsername",
      password: "testPassword1234!!",
      totalAssets: 0,
      email: "testEmail@gmail.com",
      incomes: [],
      trusted: true,
    };

    showIncomeFormState = vi.fn((e) => e.preventDefault());
    handleChange = vi.fn();
    handlePress = vi.fn((e) => e.preventDefault());
    handleDelete = vi.fn((e) => e.preventDefault());
    removeIncome = vi.fn();
    handleCheckBox = vi.fn();
    handleSubmit = vi.fn((e) => e.preventDefault());
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );
  });

  it("should have correct headers", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    expect(screen.getByText("Additional Information")).toBeInTheDocument();
    expect(
      screen.getByText(
        "(None of the below information is required. You will be allowed to add or remove values after registration.)"
      )
    ).toBeInTheDocument();
  });

  it("should have an input for total assets", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    expect(
      screen.getByLabelText("Total Assets: ($ U.S.):")
    ).toBeInTheDocument();
  });

  it("should initially have a key pad with 9 buttons with numbers 1 to 9", () => {
    let { container } = renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    let keypad = container.getElementsByClassName("button");
    expect(keypad).toHaveLength(9);
    expect(keypad[0]).toContainHTML("1");
    expect(keypad[1]).toContainHTML("2");
    expect(keypad[2]).toContainHTML("3");
    expect(keypad[3]).toContainHTML("4");
    expect(keypad[4]).toContainHTML("5");
    expect(keypad[5]).toContainHTML("6");
    expect(keypad[6]).toContainHTML("7");
    expect(keypad[7]).toContainHTML("8");
    expect(keypad[8]).toContainHTML("9");
  });

  it("should call handlePress function when a numbered button on keypad is clicked", () => {
    let { container } = renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    let keypad = container.getElementsByClassName("button");
    fireEvent.click(keypad[0]);
    fireEvent.click(keypad[4]);
    fireEvent.click(keypad[8]);
    expect(handlePress).toHaveBeenCalledTimes(3);
  });

  it("should show a button with the number zero and a delete key when total asset value is greater than 0", () => {
    let { container } = renderWithRedux(
      <SignUpAdditionalForm
        formData={{ ...formData, totalAssets: 5 }}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    let keypad = container.getElementsByClassName("button");
    expect(keypad).toHaveLength(10);
    expect(keypad[0]).toContainHTML("1");
    expect(keypad[1]).toContainHTML("2");
    expect(keypad[2]).toContainHTML("3");
    expect(keypad[3]).toContainHTML("4");
    expect(keypad[4]).toContainHTML("5");
    expect(keypad[5]).toContainHTML("6");
    expect(keypad[6]).toContainHTML("7");
    expect(keypad[7]).toContainHTML("8");
    expect(keypad[8]).toContainHTML("9");
    expect(keypad[9]).toContainHTML("0");

    let del = container.getElementsByClassName("button-delete");
    expect(del).toHaveLength(1);
  });

  it("should call handleDelete function when delete button on keypad is clicked", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={{ ...formData, totalAssets: 5 }}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(handleDelete).toHaveBeenCalledOnce();
  });

  it("should have a button to show income form", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    expect(screen.getByText("Add an Income")).toBeInTheDocument();
  });

  it("should call income form state change function when income form button is clicked", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    fireEvent.click(screen.getByText("Add an Income"));
    expect(showIncomeFormState).toHaveBeenCalledOnce();
  });

  it("should have a checkbox for trusted/untrusted devices", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );
    let cb = screen.getByLabelText("Do You Trust This Device?");
    expect(cb).toBeInTheDocument();
    expect(cb).toBeChecked();
  });

  it("should call handleCheckBox function whcn checkbox is clicked", () => {
    renderWithRedux(
      <SignUpAdditionalForm
        formData={formData}
        keyPadError={false}
        showIncomeFormState={showIncomeFormState}
        handleChange={handleChange}
        handlePress={handlePress}
        handleDelete={handleDelete}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
        handleSubmit={handleSubmit}
      />
    );

    fireEvent.click(screen.getByLabelText("Do You Trust This Device?"));
    expect(handleCheckBox).toHaveBeenCalled();
  });

  afterEach(() => {
    showIncomeFormState.mockClear();
    handleChange.mockClear();
    handlePress.mockClear();
    handleDelete.mockClear();
    removeIncome.mockClear();
    handleCheckBox.mockClear();
    handleSubmit.mockClear();
  });
});
