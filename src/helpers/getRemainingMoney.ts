// used for budget cards on both list of budgets and single budget pages: calculates the remaining funds in
// a budget by subtracting the funds spent from the funds allocated
// export const getRemainingMoney = (
//   moneyAllocated: string,
//   moneySpent: number
// ) => {
//   let mr = parseFloat(moneyAllocated || "") - (moneySpent || 0);
//   return mr.toFixed(2);
// };

export const getRemainingMoney = (
  moneyAllocated: number,
  moneySpent: number
): number => {
  let mr = moneyAllocated * 100 - moneySpent * 100;
  return mr / 100;
};
