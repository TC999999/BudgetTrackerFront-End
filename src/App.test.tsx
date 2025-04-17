import { describe, it } from "vitest";
import { renderWithRedux } from "./utils/test-util";

import App from "./App";

describe("App", () => {
  it("renders without crashing", () => {
    renderWithRedux(<App />);
  });
});
