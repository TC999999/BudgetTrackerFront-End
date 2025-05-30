import { describe, it, expect } from "vitest";
import { renderWithReduxTestStoreError } from "../utils/test-util";
import { screen } from "@testing-library/react";
import Error from "./Error";

describe("General Error Page", () => {
  it("should render without crashing", () => {
    renderWithReduxTestStoreError(<Error />);
  });

  it("should show proper messages", () => {
    renderWithReduxTestStoreError(<Error />);
    expect(screen.queryByText("400 ERROR")).toBeInTheDocument();
    expect(screen.queryByText("Bad Request")).toBeInTheDocument();
  });
});
