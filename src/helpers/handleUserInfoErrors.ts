import { ConfirmUserInfo, UserInfoErrors } from "../interfaces/authInterfaces";
import { isEmail } from "validator";

const returnUsernameErrors = (value: string): string => {
  return value.length === 0 ? "Username is Empty" : "";
};

const returnEmailErrors = (value: string): string => {
  if (value.length === 0) {
    return "Email is Empty";
  } else if (!isEmail(value)) {
    return "Email is Invalid";
  }
  return "";
};

export const handleUserInfoInputErrors = (
  name: string,
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
