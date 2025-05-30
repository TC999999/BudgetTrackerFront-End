import { describe, it, expect } from "vitest";
import { renderWithRedux } from "../utils/test-util";
import { screen } from "@testing-library/react";
import Logo from "./Logo";

describe("Website Logo", () => {
  it("should render without crashing", () => {
    renderWithRedux(<Logo />);
  });

  it("should show app name", () => {
    renderWithRedux(<Logo />);
    expect(screen.queryByText("Personal Piggybank")).toBeInTheDocument();
  });
});
