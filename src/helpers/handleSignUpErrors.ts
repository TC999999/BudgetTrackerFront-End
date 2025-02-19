import { SignUpInterface, SignUpErrors } from "../interfaces/authInterfaces";
import { isEmail } from "validator";

const returnUsernameErrors = (value: string): string => {
  if (value.length > 30) {
    return "Username too long";
  } else if (value.length < 5 && value.length > 0) {
    return "Username too short";
  } else if (value.length === 0) {
    return "Username is Empty";
  }
  return "";
};

const returnPasswordErrors = (value: string): string => {
  if (value.length > 20) {
    return "Password too long";
  } else if (value.length < 8 && value.length > 0) {
    return "Password too short";
  } else if (value.length === 0) {
    return "Password is Empty";
  }
  return "";
};

const returnEmailErrors = (value: string): string => {
  if (value.length === 0) {
    return "Email is Empty";
  } else if (!isEmail(value)) {
    return "Email is Invalid";
  }
  return "";
};

export const handleSignUpInputErrors = (
  name: string,
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
