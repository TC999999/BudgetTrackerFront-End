import { NewTransactionUI } from "../interfaces/transactionInterfaces";
import { Income, SubmitUpdateIncome } from "../interfaces/incomeInterfaces";
import { BudgetEditInterface } from "../interfaces/budgetInterfaces";
import { dollarConverter } from "./currencyConverter";

//returns custom strings for notifications when updating a user's profile
export const createEditUserString = (
  newUsername: string,
  originalUsername: string,
  newEmail: string,
  originalEmail: string
): string => {
  let usernameStr: string = "";
  let emailStr: string = "";

  if (newUsername !== originalUsername)
    usernameStr = ` Your username has been changed to ${newUsername}.`;

  if (newEmail !== originalEmail)
    emailStr = ` Your email address has been changed to ${newEmail}. We will be sending a confirmation email to this address now. If you do not receive an email at the new email adress, please check to see if it is spelled correctly. If you still don't see a confirmation email, please contact our team.`;

  return "Profile updated successfully!" + usernameStr + emailStr;
};

// returns custom strings for notifications when updating users' total assets
export const createUpdateUserString = (
  submitData: NewTransactionUI
): string => {
  const addOrRemove: string =
    submitData.value >= 0
      ? `Added ${dollarConverter(submitData.value)} to total savings balance.`
      : `Removed ${dollarConverter(
          submitData.value * -1
        )} from total savings balance.`;
  return "Sucessfully noted transaction! " + addOrRemove;
};

// returns custom strings for notifications when updating users' incomes
export const createUpdateIncomeString = (
  income: Income,
  submitData: SubmitUpdateIncome
): string => {
  let titleChange: string =
    income.title === submitData.title
      ? ""
      : ` Title changed to ${submitData.title}.`;
  let salaryChange: string =
    +income.salary === submitData.salary
      ? ""
      : ` Salary changed to ${dollarConverter(submitData.salary)}.`;
  let intervalChange: string =
    income.readableUpdateTimeString === submitData.readableUpdateTimeString
      ? ""
      : ` Now updates at ${submitData.readableUpdateTimeString}.`;

  return (
    `${income.title} income successfully updated!` +
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
    titleChange = ` Title changed to ${submitData.title}.`;
  }

  if (submitData.addedMoney > 0) {
    switch (submitData.operation) {
      case "add":
        addOrRemove = ` Added ${dollarConverter(
          submitData.addedMoney
        )} to total savings balance.`;
        break;
      case "subtract":
        addOrRemove = ` Removed ${dollarConverter(
          submitData.addedMoney
        )} and added it to total savings balance.`;
        break;
    }
  }

  return (
    `${originalTitle} budget updated successfully!` + titleChange + addOrRemove
  );
};
