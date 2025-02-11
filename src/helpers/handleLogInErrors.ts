import { LogInInterface, LogInErrors } from "../interfaces/authInterfaces";

const returnUsernameErrors = (value: string): string => {
  return value.length === 0 ? "Username is Empty" : "";
};

const returnPasswordErrors = (value: string): string => {
  return value.length === 0 ? "Password is Empty" : "";
};

export const handleLogInInputErrors = (
  name: string,
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
