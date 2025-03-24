import { LogInInterface, LogInErrors } from "../interfaces/authInterfaces";

// returns string if username login input value is empty string
const returnUsernameErrors = (value: string): string => {
  return value.length === 0 ? "Username is Empty" : "";
};

// returns string if password login user input value is empty string
const returnPasswordErrors = (value: string): string => {
  return value.length === 0 ? "Password is Empty" : "";
};

// updates login form error state when input value changes
export const handleLogInInputErrors = (
  name: "username" | "password",
  value: string,
  setter: React.Dispatch<React.SetStateAction<LogInErrors>>
): void => {
  switch (name) {
    case "username":
      setter((data) => ({ ...data, username: returnUsernameErrors(value) }));
      break;
    case "password":
      setter((data) => ({ ...data, password: returnPasswordErrors(value) }));
      break;
  }
};

// updates login form error state when form is submitted, returns true if all inputs are error free
export const handleLogInSubmitErrors = (
  logInInfo: LogInInterface,
  setter: React.Dispatch<React.SetStateAction<LogInErrors>>
): boolean => {
  handleLogInInputErrors("username", logInInfo.username, setter);
  handleLogInInputErrors("password", logInInfo.password, setter);
  return (
    returnUsernameErrors(logInInfo.username) === "" &&
    returnPasswordErrors(logInInfo.password) === ""
  );
};
