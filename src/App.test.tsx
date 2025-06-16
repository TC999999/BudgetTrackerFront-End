import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import { renderWithRedux, renderWithReduxTestStore } from "../utils/test-util";
import { screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  let mock: Mock;

  beforeAll(() => {
    mock = vi.fn();
  });

  it("renders without crashing", () => {
    renderWithRedux(<App mock={mock} />);
  });

  it("should not show navbar when user is not logged in", () => {
    renderWithRedux(<App mock={mock} />);
    let button = screen.queryByRole("button", { name: "Log Out" });
    expect(button).not.toBeInTheDocument();
  });

  it("should show navbar when user is logged in", () => {
    renderWithReduxTestStore(<App mock={mock} />);
    let button = screen.queryByRole("button", { name: "Log Out" });
    expect(button).toBeInTheDocument();
  });
});
