import { isEmail } from "validator";

// returns custom string error for username input
export const returnUsernameErrors = (value: string): string => {
  if (value.length === 0) {
    return "Username input cannot be empty.";
  } else if (!/^[\w]+$/i.test(value)) {
    return "Username input contains invalid characters.";
  } else if (value.length > 30) {
    return "Username must be less than 30 characters.";
  } else if (value.length < 6 && value.length > 0) {
    return "Username must be more than 6 characters.";
  }
  return "";
};

// returns custom strings for input errors for password input
export const returnPasswordErrors = (newPassword: string): string => {
  if (newPassword.length === 0) {
    return "Password input cannot be empty.";
  } else if (!/^[\w!?&$#%]+$/i.test(newPassword)) {
    return "Password input contains invalid characters.";
  } else if (newPassword.length > 20) {
    return "Password must be less than 20 characters.";
  } else if (newPassword.length < 16 && newPassword.length > 0) {
    return "Password must be greater than 16 characters.";
  }
  return "";
};

type auth = "Username" | "Password";
// returns string if input value is empty string (When we're looking for values that already exist and not creating new ones)
export const returnEmptyInputErrors = (value: string, type: auth): string => {
  return value.length === 0 ? `${type} input cannot be empty` : "";
};

// returns custom strings for input errors for new password confirmation input
export const returnConfirmPasswordErrors = (
  newPassword: string,
  confirmNewPassword: string
): string => {
  if (confirmNewPassword === "") {
    return "Password confirmation input cannot be empty.";
  } else if (confirmNewPassword !== newPassword) {
    return "Does not match password above!";
  }
  return "";
};

// returns custom string error for email input
export const returnEmailErrors = (value: string): string => {
  if (value.length === 0) {
    return "Email address input cannot be empty";
  } else if (!isEmail(value)) {
    return "Email address is invalid.";
  }
  return "";
};

type title = "Transaction" | "Expense" | "Budget" | "Income";
// returns custom strings for input errors in titles
export const returnTitleErrors = (title: string, type: title): string => {
  if (title.length === 0) {
    return `${type} title input cannot be empty.`;
  } else if (!/^[\w-'":/ ]+$/i.test(title)) {
    return `${type} title input contains invalid characters.`;
  } else if (/^\s+|\s+$/g.test(title)) {
    return `${type} title input cannot have spaces at beginning or end.`;
  } else if (0 < title.length && title.length < 3) {
    return `${type} title must be greater than 3 characters.`;
  } else if (20 < title.length) {
    return `${type} title must be less than 20 characters.`;
  } else {
    return "";
  }
};

// returns custom strings for input errors in monetary values
export const returnValueErrors = (value: number, type: title): string => {
  return value === 0 ? `${type} value must be greater than $0.00.` : "";
};

// returns custom strings for input errors in dates
export const returnDateErrors = (date: string, type: title): string => {
  return date.length <= 0 ? `${type} Date is Required` : "";
};
