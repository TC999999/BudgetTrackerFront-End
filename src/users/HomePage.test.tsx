import { describe, it, expect, beforeAll, Mock, vi } from "vitest";
import {
  renderWithRedux,
  renderWithReduxTestStore,
} from "../../utils/test-util";
import { screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("Homepage", () => {
  let mock: Mock;

  beforeAll(() => {
    mock = vi.fn();
  });

  it("should render without crashing", () => {
    renderWithRedux(<HomePage mock={mock} />);
  });

  it("should show login page when no user is logged in", () => {
    renderWithRedux(<HomePage mock={mock} />);
    expect(screen.queryByText("Log in Here!")).toBeInTheDocument();
    expect(screen.queryByText("testuser")).not.toBeInTheDocument();
  });

  it("should show dashboard page when user is logged in", () => {
    renderWithReduxTestStore(<HomePage mock={mock} />);
    expect(screen.queryByText("Log in Here!")).not.toBeInTheDocument();
    expect(screen.queryByText("testuser")).toBeInTheDocument();
  });
});
