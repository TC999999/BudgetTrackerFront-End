export const calculateNewTotalAssets = (
  totalAssets: number,
  newFunds: number,
  operation: string
): string => {
  let totalAssetsNum = +totalAssets * 100;
  let newAssets: number =
    operation === "add" ? totalAssetsNum - newFunds : totalAssetsNum + newFunds;

  return (newAssets / 100).toFixed(2);
};

export const calculateNewTotalAssetsWithoutOperation = (
  totalAssets: number,
  newFunds: number
): string => {
  let totalAssetsNum = +totalAssets;
  let newAssets: number = totalAssetsNum + newFunds;

  return newAssets.toFixed(2);
};
