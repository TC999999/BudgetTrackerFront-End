import { describe, it, expect } from "vitest";
import { renderWithRedux, renderWithReduxTestStore } from "../utils/test-util";
import { screen } from "@testing-library/react";
import LoadingMsg from "./LoadingUserMsg";

describe("Loading User Message", () => {
  it("should render without crashing", () => {
    renderWithRedux(<LoadingMsg />);
  });

  it("should show correct message", () => {
    renderWithRedux(<LoadingMsg />);
    expect(screen.queryByText("Loading")).toBeInTheDocument();
  });

  it("should should not appear when user exists in store", () => {
    renderWithReduxTestStore(<LoadingMsg />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });
});
