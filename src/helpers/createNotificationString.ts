import { UserEditInterface } from "../interfaces/userInterfaces";
import { Income, SubmitUpdateIncome } from "../interfaces/incomeInterfaces";
import { BudgetEditInterface } from "../interfaces/budgetInterfaces";

export const createUpdateUserString = (
  submitData: UserEditInterface
): string => {
  const addOrRemove: string =
    submitData.value >= 0
      ? `Added $${submitData.value.toFixed(2)} to available assets.`
      : `Removed $${(submitData.value * -1).toFixed(2)} from available assets.`;
  return "Succssfully updated assets! " + addOrRemove;
};

export const createUpdateIncomeString = (
  income: Income,
  submitData: SubmitUpdateIncome
): string => {
  let titleChange: string =
    income.title === submitData.title
      ? ""
      : `Title changed to ${submitData.title}. `;
  let salaryChange: string =
    +income.salary === submitData.salary
      ? ""
      : `Salary changed to $${submitData.salary.toFixed(2)}. `;
  let intervalChange: string =
    income.readableUpdateTimeString === submitData.readableUpdateTimeString
      ? ""
      : `Now updates at ${submitData.readableUpdateTimeString}.`;

  return (
    `${income.title} income successfully updated! ` +
    titleChange +
    salaryChange +
    intervalChange
  );
};

export const createUpdateBudgetString = (
  originalTitle: string,
  submitData: BudgetEditInterface
): string => {
  let titleChange: string = "";
  let addOrRemove: string = "";

  if (originalTitle !== submitData.title) {
    titleChange = `Title changed to ${submitData.title}.`;
  }

  if (submitData.addedMoney > 0) {
    addOrRemove =
      submitData.operation === "add"
        ? `Added $${(submitData.addedMoney / 100).toFixed(
            2
          )} from available assets.`
        : `Removed $${(submitData.addedMoney / 100).toFixed(
            2
          )} and added it to available assets.`;
  }

  return `${originalTitle} budget updated successfully! ${titleChange} ${addOrRemove}`;
};
