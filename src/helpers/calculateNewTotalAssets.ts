// Used for budget forms: calcuates the new total asset value to be displayed on a form before submitting.
// if operation is add, removes funds from total assets and adds it to the budget funds and vice versa if
// operation is subtract
export const calculateNewTotalAssets = (
  totalAssets: number,
  newFunds: number,
  operation: string
): string => {
  let totalAssetsNum = +totalAssets * 100;
  switch (operation) {
    case "add":
      return ((totalAssetsNum - newFunds) / 100).toFixed(2);
    case "subtract":
      return ((totalAssetsNum + newFunds) / 100).toFixed(2);
    default:
      return "";
  }
};

// Used for edit user forms: calcuates the new total asset value to be displayed on a form before submitting.
// if operation is add, adds new funds to total assets and vice versa if operation is subtract
export const calculateNewTotalAssetsUserDashboard = (
  totalAssets: number,
  newFunds: number,
  operation: string
): string => {
  let totalAssetsNum = totalAssets * 100;
  switch (operation) {
    case "add":
      return ((totalAssetsNum + newFunds) / 100).toFixed(2);
    case "subtract":
      return ((totalAssetsNum - newFunds) / 100).toFixed(2);
    default:
      return "";
  }
};

// Used when deleting budgets, adds value determined by user back to total assets when deleting a budget
export const calculateNewTotalAssetsWithoutOperation = (
  totalAssets: number,
  newFunds: number
): string => {
  let totalAssetsNum = +totalAssets;
  let newAssets: number = totalAssetsNum + newFunds;

  return newAssets.toFixed(2);
};
