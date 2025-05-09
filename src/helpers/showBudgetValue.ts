// used for budget update form: calculates new budget value based on the original value, the
// operation (add or subtract) and the funds to be added or subtracted
export const getNewBudgetValue = (
  originalMoney: number,
  newFunds: number,
  operation: "add" | "subtract"
): number => {
  switch (operation) {
    case "add": {
      let newMoney: number = originalMoney * 100 + newFunds * 100;
      return newMoney / 100;
    }
    case "subtract": {
      let newMoney: number = originalMoney * 100 - newFunds * 100;
      return newMoney / 100;
    }
  }
};
