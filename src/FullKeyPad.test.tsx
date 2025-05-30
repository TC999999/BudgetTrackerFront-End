import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithRedux } from "../utils/test-util";
import { screen, fireEvent } from "@testing-library/react";
import FullKeyPad from "./FullKeyPad";

describe("Verification Code Keypad", () => {
  let handlePress: Mock;
  let handleDelete: Mock;

  beforeAll(() => {
    handlePress = vi.fn();
    handleDelete = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(
      <FullKeyPad handlePress={handlePress} handleDelete={handleDelete} />
    );
  });

  it("should only have eleven buttons", () => {
    renderWithRedux(
      <FullKeyPad handlePress={handlePress} handleDelete={handleDelete} />
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
    expect(screen.queryByText("0")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).toBeInTheDocument();
  });

  it("should call handlePress function when numbered button is pressed", () => {
    renderWithRedux(
      <FullKeyPad handlePress={handlePress} handleDelete={handleDelete} />
    );
    let one = screen.getByRole("button", { name: "1" });
    fireEvent.click(one);
    expect(handlePress).toHaveBeenCalled();
  });

  it("should call handleDelete function when delete button is pressed", () => {
    renderWithRedux(
      <FullKeyPad handlePress={handlePress} handleDelete={handleDelete} />
    );
    let del = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(del);
    expect(handleDelete).toHaveBeenCalled();
  });
});
