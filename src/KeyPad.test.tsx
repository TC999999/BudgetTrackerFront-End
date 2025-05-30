import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithRedux } from "../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import KeyPad from "./KeyPad";

describe("Monetary Value Keypad", () => {
  let handlePress: Mock;
  let handleDelete: Mock;

  beforeAll(() => {
    handlePress = vi.fn();
    handleDelete = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <KeyPad handlePress={handlePress} handleDelete={handleDelete} num={0} />
    );
  });

  it("should only have nine buttons when num is zero", () => {
    renderWithRedux(
      <KeyPad handlePress={handlePress} handleDelete={handleDelete} num={0} />
    );
    expect(screen.queryByText("1")).toBeInTheDocument();
    expect(screen.queryByText("2")).toBeInTheDocument();
    expect(screen.queryByText("3")).toBeInTheDocument();
    expect(screen.queryByText("4")).toBeInTheDocument();
    expect(screen.queryByText("5")).toBeInTheDocument();
    expect(screen.queryByText("6")).toBeInTheDocument();
    expect(screen.queryByText("7")).toBeInTheDocument();
    expect(screen.queryByText("8")).toBeInTheDocument();
    expect(screen.queryByText("9")).toBeInTheDocument();

    expect(screen.queryByText("0")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("should have eleven buttons when num is greater than zero", () => {
    renderWithRedux(
      <KeyPad handlePress={handlePress} handleDelete={handleDelete} num={100} />
    );
    expect(screen.queryByText("0")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).toBeInTheDocument();
  });

  it("should call handlePress function when numbered button is pressed", () => {
    renderWithRedux(
      <KeyPad handlePress={handlePress} handleDelete={handleDelete} num={0} />
    );
    let one = screen.getByRole("button", { name: "1" });
    fireEvent.click(one);
    expect(handlePress).toHaveBeenCalled();
  });

  it("should call handleDelete function when delete button is pressed", () => {
    renderWithRedux(
      <KeyPad handlePress={handlePress} handleDelete={handleDelete} num={1} />
    );
    let del = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(del);
    expect(handleDelete).toHaveBeenCalled();
  });
});
