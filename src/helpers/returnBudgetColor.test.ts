import { returnBudgetColor } from "./returnBudgetColor";
import { describe, it, expect } from "vitest";

describe("helper function that returns tailwindcss color for proper budget CRUD operation", () => {
  it("should return the correct string for each operation", () => {
    expect(returnBudgetColor("Created")).toBe("text-emerald-700");
    expect(returnBudgetColor("Edited")).toBe("text-orange-700");
    expect(returnBudgetColor("Deleted")).toBe("text-red-600");
    expect(returnBudgetColor("-")).toBe("text-black");
  });
});
