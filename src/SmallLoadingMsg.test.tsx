import { describe, it, expect } from "vitest";
import {
  renderWithReduxTestStore,
  renderWithReduxTestStorePageLoading,
} from "../utils/test-util";
import { screen } from "@testing-library/react";
import SmallLoadingMsg from "./SmallLoadingMsg";

describe("Small Loading Message", () => {
  it("should render without crashing", () => {
    renderWithReduxTestStorePageLoading(<SmallLoadingMsg />);
  });

  it("should show when page is loading", () => {
    renderWithReduxTestStorePageLoading(<SmallLoadingMsg />);
    expect(screen.queryByText("Loading")).toBeInTheDocument();
  });

  it("should show when page is loading", () => {
    renderWithReduxTestStore(<SmallLoadingMsg />);
    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });
});
