import { describe, it, expect } from "vitest";
import { renderWithRedux, renderWithReduxTestStore } from "../utils/test-util";
import { screen } from "@testing-library/react";
import NotFound from "./NotFound";

describe("404 Error Page", () => {
  it("should render without crashing", () => {
    renderWithRedux(<NotFound />);
  });

  it("should show proper messages", () => {
    renderWithRedux(<NotFound />);
    expect(screen.queryByText("404 ERROR")).toBeInTheDocument();
    expect(
      screen.queryByText("The page you were trying to look for does not exist!")
    ).toBeInTheDocument();
  });

  it("should show login link if user is not logged in", () => {
    renderWithRedux(<NotFound />);
    expect(screen.queryByText("Go Back to Login")).toBeInTheDocument();
  });

  it("should not show login link if user is logged in", () => {
    renderWithReduxTestStore(<NotFound />);
    expect(screen.queryByText("Go Back to Login")).not.toBeInTheDocument();
  });
});
