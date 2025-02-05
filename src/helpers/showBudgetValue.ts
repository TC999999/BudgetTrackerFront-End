export const addBudgetValue = (
  originalMoney: string,
  newFunds: number
): string => {
  let newMoney: number = +originalMoney * 100 + newFunds;
  return `New Budget Funds: $${(newMoney / 100).toFixed(2)}`;
};

export const subtractBudgetValue = (
  originalMoney: string,
  newFunds: number
): string => {
  let newMoney: number = +originalMoney * 100 - newFunds;
  return newMoney >= 0
    ? `New Budget Funds: $${(newMoney / 100).toFixed(2)}`
    : "Cannot subract this amount from budget";
};
