import { returnBudgetColor } from "./returnBudgetColor";
import { describe, it, expect } from "vitest";

describe("Tailwind CSS Color Helper Function", () => {
  it("should return the correct string for each operation", () => {
    expect(returnBudgetColor("Created")).toBe("text-emerald-700");
    expect(returnBudgetColor("Edited")).toBe("text-orange-700");
    expect(returnBudgetColor("Deleted")).toBe("text-red-600");
    expect(returnBudgetColor("-")).toBe("text-black");
  });
});
