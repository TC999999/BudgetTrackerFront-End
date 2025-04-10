export const calcNewMoneyRemaining = (
  moneyRemaining: string,
  transaction: number
): string => {
  return (parseFloat(moneyRemaining) + +transaction).toFixed(2);
};

export const calcNewMoneySpent = (moneySpent: number, transaction: number) => {
  return (+moneySpent - +transaction).toFixed(2);
};
