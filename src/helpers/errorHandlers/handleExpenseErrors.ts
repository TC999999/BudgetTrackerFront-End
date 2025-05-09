import {
  newExpenseInterface,
  ExpenseFormErrors,
} from "../../interfaces/expenseInterfaces";
import {
  returnTitleErrors,
  returnValueErrors,
  returnDateErrors,
} from "./commonHandlers";

// updates form errors state on expense form when input value changes
export const handleExpenseInputErrors = (
  name: string,
  value: string | number,
  setter: React.Dispatch<React.SetStateAction<ExpenseFormErrors>>
): void => {
  switch (name) {
    case "title":
      if (typeof value === "string") {
        setter((data) => ({
          ...data,
          title: returnTitleErrors(value, "Expense"),
        }));
      }
      break;
    case "transaction":
      if (typeof value === "number") {
        setter((data) => ({
          ...data,
          transaction: returnValueErrors(value, "Expense"),
        }));
      }
      break;
    case "date":
      if (typeof value === "string") {
        setter((data) => ({
          ...data,
          date: returnDateErrors(value, "Expense"),
        }));
      }
      break;
    default:
      break;
  }
};

// updates form errors on new expense form state when form is submitted, returns true if all inputs
// are error-free
export const handleExpenseSubmitErrors = (
  newExpenseInfo: newExpenseInterface,
  setter: React.Dispatch<React.SetStateAction<ExpenseFormErrors>>
): boolean => {
  handleExpenseInputErrors("title", newExpenseInfo.title, setter);
  handleExpenseInputErrors("transaction", newExpenseInfo.transaction, setter);
  handleExpenseInputErrors("date", newExpenseInfo.date, setter);
  return (
    returnTitleErrors(newExpenseInfo.title, "Expense") === "" &&
    returnValueErrors(newExpenseInfo.transaction, "Expense") === "" &&
    returnDateErrors(newExpenseInfo.date, "Expense") === ""
  );
};
