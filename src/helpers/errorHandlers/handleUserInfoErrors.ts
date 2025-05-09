import {
  ConfirmUserInfo,
  UserInfoErrors,
} from "../../interfaces/authInterfaces";
import { returnUsernameErrors, returnEmailErrors } from "./commonHandlers";

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
