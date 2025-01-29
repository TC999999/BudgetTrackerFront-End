export const getRemainingMoney = (
  moneyAllocated: string,
  moneySpent: number
) => {
  let mr = parseFloat(moneyAllocated || "") - (moneySpent || 0);
  return mr.toFixed(2);
};
