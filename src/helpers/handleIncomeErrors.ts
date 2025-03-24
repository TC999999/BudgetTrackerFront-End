import { NewIncome, IncomeErrors } from "../interfaces/incomeInterfaces";

// returns custom strings for input errors for income forms title input (new or update)
const returnTitleErrors = (title: string): string => {
  if (title.length === 0) return "Income title cannot be empty";
  else if (!/^[\w ]+$/i.test(title))
    return "Income title input contains invalid characters";
  else if (/^\s+|\s+$/g.test(title))
    return "Income title input cannot have spaces at beginning or end.";
  else if (title.length > 0 && title.length < 4)
    return "Income title is too short";
  else if (title.length > 20) return "Income title is too long";
  else return "";
};

// returns custom strings for input errors for income forms salary input (new or update)
const returnSalaryErrors = (salary: number): string => {
  if (salary === 0) return "Income salary must be greater than $0.00";
  else return "";
};

// updates form error state on income forms (new or update) when input value changes
export const handleIncomeInputErrors = (
  name: "title" | "salary",
  value: string | number,
  setter: React.Dispatch<React.SetStateAction<IncomeErrors>>
): void => {
  switch (name) {
    case "title":
      if (typeof value === "string") {
        setter((data) => ({ ...data, title: returnTitleErrors(value) }));
      }
      break;
    case "salary":
      if (typeof value === "number") {
        setter((data) => ({ ...data, salary: returnSalaryErrors(value) }));
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
    returnTitleErrors(newIncomeInfo.title) === "" &&
    returnSalaryErrors(newIncomeInfo.salary) === ""
  );
};
