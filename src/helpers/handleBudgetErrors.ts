import {
  newBudgetInterface,
  BudgetFormErrors,
  UpdateBudgetFormErrors,
  BudgetEditInterface,
} from "../interfaces/budgetInterfaces";

// returns custom strings for input errors in budget form title
const handleBudgetTitleErrors = (title: string): string => {
  if (title.length === 0) {
    return "Budget title input cannot be empty";
  } else if (!/^[\w ]+$/i.test(title)) {
    return "Budget title input contains invalid characters";
  } else if (/^\s+|\s+$/g.test(title)) {
    return "Budget title input cannot have spaces at beginning or end.";
  } else if (0 < title.length && title.length < 3) {
    return "Budget title input is too short";
  } else if (title.length > 20) {
    return "Budget title input is too long";
  } else {
    return "";
  }
};

// returns custom strings for input errors in budget form allocated fund value
const handleBudgetFundsErrors = (funds: number): string => {
  return funds <= 0 ? "Allocated budget funds must be greater than $0.00" : "";
};

// returns custom strings for input errors in budget form radio select if selected value is add
const handleAddErrors = (newAssets: number, totalAssets: number): string => {
  return newAssets > totalAssets
    ? "New funds cannot be more that total assets"
    : "";
};

// returns custom strings for input errors in budget form radio select if selected value is subtract
const handleSubtractErrors = (
  newAssets: number,
  remainingMoney: number
): string => {
  return newAssets > remainingMoney
    ? "New funds cannot be more than remaining budget funds"
    : "";
};

// updates form errors state when a radio button is clicked
export const handleUpdateBudgetComparisons = (
  newNum: number,
  totalAssets: number,
  operation: string,
  moneyRemaining: number,
  setter: React.Dispatch<React.SetStateAction<UpdateBudgetFormErrors>>
): boolean => {
  let errorExists: boolean = false;
  switch (operation) {
    case "add":
      let addMessage = handleAddErrors(newNum, totalAssets);
      setter((data) => ({ ...data, addedMoney: addMessage }));
      errorExists = addMessage.length > 0;
      break;
    case "subtract":
      let subtractMessage = handleSubtractErrors(newNum, moneyRemaining);
      setter((data) => ({ ...data, addedMoney: subtractMessage }));
      errorExists = subtractMessage.length > 0;
      break;
    default:
      break;
  }
  return errorExists;
};

// updates form errors on new budget form state when input value changes
export const handleBudgetInputErrors = (
  name: "title" | "moneyAllocated",
  value: string | number,
  setter: React.Dispatch<React.SetStateAction<BudgetFormErrors>>
): void => {
  switch (name) {
    case "title":
      if (typeof value === "string") {
        setter((data) => ({ ...data, title: handleBudgetTitleErrors(value) }));
      }
      break;
    case "moneyAllocated":
      if (typeof value === "number") {
        setter((data) => ({
          ...data,
          moneyAllocated: handleBudgetFundsErrors(value),
        }));
      }
      break;
    default:
      break;
  }
};

// updates form errors on update budget form state when input value changes
export const handleUpdateBudgetInputErrors = (
  name: "title" | "addedMoney",
  value: string | number,
  setter: React.Dispatch<React.SetStateAction<UpdateBudgetFormErrors>>
): void => {
  switch (name) {
    case "title":
      if (typeof value === "string") {
        setter((data) => ({ ...data, title: handleBudgetTitleErrors(value) }));
      }
      break;
    case "addedMoney":
      if (typeof value === "number") {
        setter((data) => ({
          ...data,
          addedMoney: handleBudgetFundsErrors(value),
        }));
      }
      break;
    default:
      break;
  }
};

// updates form errors on new budget form state when form is submitted, returns true if all inputs
// are error-free
export const handleBudgetSubmitErrors = (
  newBudgetInfo: newBudgetInterface,
  setter: React.Dispatch<React.SetStateAction<BudgetFormErrors>>
): boolean => {
  handleBudgetInputErrors("title", newBudgetInfo.title, setter);
  handleBudgetInputErrors(
    "moneyAllocated",
    newBudgetInfo.moneyAllocated,
    setter
  );
  return (
    handleBudgetTitleErrors(newBudgetInfo.title) === "" &&
    handleBudgetFundsErrors(newBudgetInfo.moneyAllocated) === ""
  );
};

// updates form errors on update budget form state when form is submitted, returns true if all inputs
// are error-free
export const handleUpdateBudgetSubmitErrors = (
  newBudgetInfo: BudgetEditInterface,
  setter: React.Dispatch<React.SetStateAction<UpdateBudgetFormErrors>>
): boolean => {
  handleUpdateBudgetInputErrors("title", newBudgetInfo.title, setter);
  return handleBudgetTitleErrors(newBudgetInfo.title) === "";
};
