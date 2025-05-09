// used for budget cards on both list of budgets and single budget pages: calculates the remaining funds in
// a budget by subtracting the funds spent from the funds allocated
export const getRemainingMoney = (
  moneyAllocated: number,
  moneySpent: number
): number => {
  let mr = moneyAllocated * 100 - moneySpent * 100;
  return mr / 100;
};
