import { ConfirmUserInfo, UserInfoErrors } from "../interfaces/authInterfaces";
import { isEmail } from "validator";

// returns custom string error if the username input value is empty on the reset password user info form
const returnUsernameErrors = (value: string): string => {
  return value.length === 0 ? "Username is Empty" : "";
};

// returns custom string for the username input value errors n the reset password user info form
const returnEmailErrors = (value: string): string => {
  if (value.length === 0) {
    return "Email is Empty";
  } else if (!isEmail(value)) {
    return "Email is Invalid";
  }
  return "";
};

// updates reset password user info form errors state when an input value changes
export const handleUserInfoInputErrors = (
  name: "username" | "email",
  value: string,
  setter: React.Dispatch<React.SetStateAction<UserInfoErrors>>
): void => {
  switch (name) {
    case "username":
      setter((data) => ({ ...data, username: returnUsernameErrors(value) }));
      break;
    case "email":
      setter((data) => ({ ...data, email: returnEmailErrors(value) }));
      break;
    default:
      break;
  }
};

// updates reset password user info form errors state when form is submitted; returns true if all form input
// values are error free
export const handleUserInfoSubmitErrors = (
  userInfo: ConfirmUserInfo,
  setter: React.Dispatch<React.SetStateAction<UserInfoErrors>>
): boolean => {
  handleUserInfoInputErrors("username", userInfo.username, setter);
  handleUserInfoInputErrors("email", userInfo.email, setter);
  return (
    returnUsernameErrors(userInfo.username) === "" &&
    returnEmailErrors(userInfo.email) === ""
  );
};
