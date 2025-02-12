import {
  newBudgetInterface,
  BudgetFormErrors,
} from "../interfaces/budgetInterfaces";

const handleBudgetTitleErrors = (title: string): string => {
  if (title.length === 0) {
    return "Title input is empty";
  } else if (0 < title.length && title.length < 3) {
    return "Title input is too short";
  } else if (title.length > 20) {
    return "Title input is too long";
  } else {
    return "";
  }
};

const handleBudgetFundsErrors = (funds: number): string => {
  return funds <= 0 ? "Allocated budget funds must be greater than $0.00" : "";
};

export const handleBudgetInputErrors = (
  name: string,
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
