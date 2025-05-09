import { EditUser, EditUserErrors } from "../../interfaces/userInterfaces";
import {
  returnUsernameErrors,
  returnEmailErrors,
  returnEmptyInputErrors,
} from "./commonHandlers";

// updates reset password user info form errors state when an input value changes
export const handleUserEditInputErrors = (
  name: "username" | "email" | "password",
  value: string,
  setter: React.Dispatch<React.SetStateAction<EditUserErrors>>
): void => {
  switch (name) {
    case "username":
      setter((data) => ({ ...data, username: returnUsernameErrors(value) }));
      break;
    case "email":
      setter((data) => ({ ...data, email: returnEmailErrors(value) }));
      break;
    case "password":
      setter((data) => ({
        ...data,
        password: returnEmptyInputErrors(value, "Password"),
      }));
      break;
  }
};

// updates reset password user info form errors state when form is submitted; returns true if all form input
// values are error free
export const handleUserEditSubmitErrors = (
  userInfo: EditUser,
  setter: React.Dispatch<React.SetStateAction<EditUserErrors>>
): boolean => {
  handleUserEditInputErrors("username", userInfo.username, setter);
  handleUserEditInputErrors("email", userInfo.email, setter);
  handleUserEditInputErrors("password", userInfo.password, setter);
  return (
    returnUsernameErrors(userInfo.username) === "" &&
    returnEmailErrors(userInfo.email) === "" &&
    returnEmptyInputErrors(userInfo.password, "Password") === ""
  );
};
