import { SignUpInterface, SignUpErrors } from "../interfaces/authInterfaces";
import { isEmail } from "validator";

// returns custom strings for username input value errors in sign up form
const returnUsernameErrors = (value: string): string => {
  if (value.length === 0) {
    return "Username input cannot be empty.";
  } else if (!/^[\w]+$/i.test(value)) {
    return "Username input contains invalid characters.";
  } else if (value.length > 30) {
    return "Username input is too long.";
  } else if (value.length < 6 && value.length > 0) {
    return "Username input is too short.";
  }
  return "";
};

// returns custom strings for password input value errors in sign up form
const returnPasswordErrors = (value: string): string => {
  if (value.length === 0) {
    return "Password input cannot be empty.";
  } else if (!/^[\w!?&$#%]+$/i.test(value)) {
    return "Password input contains invalid characters.";
  } else if (value.length > 20) {
    return "Password input is too long.";
  } else if (value.length < 16 && value.length > 0) {
    return "Password input is too short.";
  }
  return "";
};

// returns custom strings for email input value errors in sign up form
const returnEmailErrors = (value: string): string => {
  if (value.length === 0) {
    return "Email Address input cannot be is empty.";
  } else if (!isEmail(value)) {
    return "Invalid Email Address";
  }
  return "";
};

// updates sign up form errors state when input value changes
export const handleSignUpInputErrors = (
  name: "username" | "password" | "email",
  value: string,
  setter: React.Dispatch<React.SetStateAction<SignUpErrors>>
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
    default:
      break;
  }
};

// updates sign up form errors state when form is submitted; returns true if all input values are error free
export const handleSignUpSubmitErrors = (
  signUpInfo: SignUpInterface,
  setter: React.Dispatch<React.SetStateAction<SignUpErrors>>
): boolean => {
  handleSignUpInputErrors("username", signUpInfo.username, setter);
  handleSignUpInputErrors("password", signUpInfo.password, setter);
  handleSignUpInputErrors("email", signUpInfo.email, setter);
  return (
    returnUsernameErrors(signUpInfo.username) === "" &&
    returnPasswordErrors(signUpInfo.password) === "" &&
    returnEmailErrors(signUpInfo.email) === ""
  );
};
