export const getNewBudgetValue = (
  originalMoney: string,
  newFunds: number,
  operation: string
): string => {
  switch (operation) {
    case "add": {
      let newMoney: number = +originalMoney * 100 + newFunds;
      return `$${(newMoney / 100).toFixed(2)}`;
    }
    case "subtract": {
      let newMoney: number = +originalMoney * 100 - newFunds;
      return newMoney >= 0
        ? `$${(newMoney / 100).toFixed(2)}`
        : "Cannot subract this amount from budget";
    }
    default: {
      return originalMoney;
    }
  }
};
