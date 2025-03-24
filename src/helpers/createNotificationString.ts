import { UserEditInterface } from "../interfaces/userInterfaces";
import { Income, SubmitUpdateIncome } from "../interfaces/incomeInterfaces";
import { BudgetEditInterface } from "../interfaces/budgetInterfaces";

// returns custom strings for notifications when updating users' total assets
export const createUpdateUserString = (
  submitData: UserEditInterface
): string => {
  const addOrRemove: string =
    submitData.value >= 0
      ? `Added $${submitData.value.toFixed(2)} to available assets.`
      : `Removed $${(submitData.value * -1).toFixed(2)} from available assets.`;
  return "Succssfully updated assets! " + addOrRemove;
};

// returns custom strings for notifications when updating users' incomes
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

// returns custom strings for notifications when updating users' budgets
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
    switch (submitData.operation) {
      case "add":
        addOrRemove = `Added $${(submitData.addedMoney / 100).toFixed(
          2
        )} from available assets.`;
        break;
      case "subtract":
        addOrRemove = `Removed $${(submitData.addedMoney / 100).toFixed(
          2
        )} and added it to available assets.`;
        break;
    }
  }

  return `${originalTitle} budget updated successfully! ${titleChange} ${addOrRemove}`;
};
