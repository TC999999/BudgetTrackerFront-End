// calculates the new value for remaining money in a budget before a budget expense is deleted
export const calcNewMoneyRemaining = (
  moneyRemaining: number,
  transaction: number
): number => {
  return (moneyRemaining * 100 + transaction * 100) / 100;
};

// calculates the new value for money spent in a budget before a budget expense is deleted
export const calcNewMoneySpent = (
  moneySpent: number,
  transaction: number
): number => {
  return (moneySpent * 100 - transaction * 100) / 100;
};
