// Used for budget forms: calcuates the new total asset value to be displayed on a form before submitting.
// if operation is add, removes funds from total assets and adds it to the budget funds and vice versa if
// operation is subtract
export const calculateNewTotalAssets = (
  totalAssets: number,
  newFunds: number,
  operation: "add" | "subtract"
): number => {
  switch (operation) {
    case "add":
      return (totalAssets * 100 - newFunds * 100) / 100;
    case "subtract":
      return (totalAssets * 100 + newFunds * 100) / 100;
  }
};

// Used for new transaction form: calcuates the new total asset value to be displayed on a
// form before submitting. if operation is add, adds new funds to total assets and
// vice versa if operation is subtract
export const calculateNewTotalAssetsUserDashboard = (
  totalAssets: number,
  newFunds: number,
  operation: "add" | "subtract"
): number => {
  switch (operation) {
    case "add":
      return (totalAssets * 100 + newFunds * 100) / 100;
    case "subtract":
      return (totalAssets * 100 - newFunds * 100) / 100;
  }
};

// Used when deleting budgets, adds value determined by user back to total assets when deleting a budget
export const calculateNewTotalAssetsWithoutOperation = (
  totalAssets: number,
  newFunds: number
): number => {
  let newAssets: number = (totalAssets * 100 + newFunds * 100) / 100;
  return newAssets;
};
