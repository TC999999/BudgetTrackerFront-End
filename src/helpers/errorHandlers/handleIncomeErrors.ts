import { NewIncome, IncomeErrors } from "../../interfaces/incomeInterfaces";
import { returnTitleErrors, returnValueErrors } from "./commonHandlers";

// updates form error state on income forms (new or update) when input value changes
export const handleIncomeInputErrors = (
  name: "title" | "salary",
  value: string | number,
  setter: React.Dispatch<React.SetStateAction<IncomeErrors>>
): void => {
  switch (name) {
    case "title":
      if (typeof value === "string") {
        setter((data) => ({
          ...data,
          title: returnTitleErrors(value, "Income"),
        }));
      }
      break;
    case "salary":
      if (typeof value === "number") {
        setter((data) => ({
          ...data,
          salary: returnValueErrors(value, "Income"),
        }));
      }
      break;
    default:
      break;
  }
};

// updates form error state on income forms (new or update) when form is submitted, returns true if all inputs
// are error-free
export const handleIncomeSubmitErrors = (
  newIncomeInfo: NewIncome,
  setter: React.Dispatch<React.SetStateAction<IncomeErrors>>
): boolean => {
  handleIncomeInputErrors("title", newIncomeInfo.title, setter);
  handleIncomeInputErrors("salary", newIncomeInfo.salary, setter);
  return (
    returnTitleErrors(newIncomeInfo.title, "Income") === "" &&
    returnValueErrors(newIncomeInfo.salary, "Income") === ""
  );
};
