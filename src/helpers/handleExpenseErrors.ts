import {
  newExpenseInterface,
  ExpenseFormErrors,
} from "../interfaces/expenseInterfaces";

const handleExpenseTitleErrors = (title: string): string => {
  if (title.length === 0) {
    return "Expense title cannot be empty";
  } else if (!/^[\w ]+$/i.test(title)) {
    return "Expense title input contains invalid characters";
  } else if (/^\s+|\s+$/g.test(title)) {
    return "Expense title input cannot have spaces at beginning or end.";
  } else if (0 < title.length && title.length < 3) {
    return "Expense title too short";
  } else if (20 < title.length) {
    return "Expense title too long";
  } else {
    return "";
  }
};

const handleExpenseTransactionErrors = (transaction: number): string => {
  return transaction <= 0 ? "Transaction value must be greater than $0.00" : "";
};

const handleExpenseDateErrors = (date: string): string => {
  return date.length <= 0 ? "Transaction Date is Required" : "";
};

export const handleExpenseInputErrors = (
  name: string,
  value: string | number,
  setter: React.Dispatch<React.SetStateAction<ExpenseFormErrors>>
): void => {
  switch (name) {
    case "title":
      if (typeof value === "string") {
        setter((data) => ({ ...data, title: handleExpenseTitleErrors(value) }));
      }
      break;
    case "transaction":
      if (typeof value === "number") {
        setter((data) => ({
          ...data,
          transaction: handleExpenseTransactionErrors(value),
        }));
      }
      break;
    case "date":
      if (typeof value === "string") {
        setter((data) => ({ ...data, date: handleExpenseDateErrors(value) }));
      }
      break;

    default:
      break;
  }
};

export const handleExpenseSubmitErrors = (
  newExpenseInfo: newExpenseInterface,
  setter: React.Dispatch<React.SetStateAction<ExpenseFormErrors>>
): boolean => {
  handleExpenseInputErrors("title", newExpenseInfo.title, setter);
  handleExpenseInputErrors("transaction", newExpenseInfo.transaction, setter);
  handleExpenseInputErrors("date", newExpenseInfo.date, setter);
  return (
    handleExpenseTitleErrors(newExpenseInfo.title) === "" &&
    handleExpenseTransactionErrors(newExpenseInfo.transaction) === "" &&
    handleExpenseDateErrors(newExpenseInfo.date) === ""
  );
};
