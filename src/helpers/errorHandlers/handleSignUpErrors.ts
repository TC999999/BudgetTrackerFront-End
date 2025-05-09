import { SignUpErrors, SignUpSensitive } from "../../interfaces/authInterfaces";
import {
  returnUsernameErrors,
  returnPasswordErrors,
  returnConfirmPasswordErrors,
  returnEmailErrors,
} from "./commonHandlers";

// updates sign up form errors state when input value changes
export const handleSignUpInputErrors = (
  name: "username" | "password" | "email" | "confirmPassword",
  value: string,
  setter: React.Dispatch<React.SetStateAction<SignUpErrors>>,
  password?: string
): void => {
  switch (name) {
    case "username":
      setter((data) => ({ ...data, username: returnUsernameErrors(value) }));
      break;
    case "password":
      setter((data) => ({ ...data, password: returnPasswordErrors(value) }));
      break;
    case "email":
      setter((data) => ({ ...data, email: returnEmailErrors(value) }));
      break;
    case "confirmPassword":
      if (password)
        setter((data) => ({
          ...data,
          confirmPassword: returnConfirmPasswordErrors(password, value),
        }));
      break;
    default:
      break;
  }
};

// updates sign up form errors state when form is submitted; returns true if all input values are error free
export const handleSignUpSubmitErrors = (
  signUpInfo: SignUpSensitive,
  setter: React.Dispatch<React.SetStateAction<SignUpErrors>>
): boolean => {
  handleSignUpInputErrors("username", signUpInfo.username, setter);
  handleSignUpInputErrors("password", signUpInfo.password, setter);
  handleSignUpInputErrors(
    "confirmPassword",
    signUpInfo.confirmPassword,
    setter,
    signUpInfo.password
  );
  handleSignUpInputErrors("email", signUpInfo.email, setter);

  return (
    returnUsernameErrors(signUpInfo.username) === "" &&
    returnPasswordErrors(signUpInfo.password) === "" &&
    returnConfirmPasswordErrors(
      signUpInfo.password,
      signUpInfo.confirmPassword
    ) === "" &&
    returnEmailErrors(signUpInfo.email) === ""
  );
};
