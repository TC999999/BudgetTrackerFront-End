// calculates the new value for remaining money in a budget before a budget expense is deleted
export const calcNewMoneyRemaining = (
  moneyRemaining: string,
  transaction: number
): string => {
  return (parseFloat(moneyRemaining) + +transaction).toFixed(2);
};

// calculates the new value for money spent in a budget before a budget expense is deleted
export const calcNewMoneySpent = (moneySpent: number, transaction: number) => {
  return (+moneySpent - +transaction).toFixed(2);
};
