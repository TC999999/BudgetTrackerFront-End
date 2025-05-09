import { LogInInterface, LogInErrors } from "../../interfaces/authInterfaces";
import { returnEmptyInputErrors } from "./commonHandlers";

// updates login form error state when input value changes
export const handleLogInInputErrors = (
  name: "username" | "password",
  value: string,
  setter: React.Dispatch<React.SetStateAction<LogInErrors>>
): void => {
  switch (name) {
    case "username":
      setter((data) => ({
        ...data,
        username: returnEmptyInputErrors(value, "Username"),
      }));
      break;
    case "password":
      setter((data) => ({
        ...data,
        password: returnEmptyInputErrors(value, "Password"),
      }));
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
    returnEmptyInputErrors(logInInfo.username, "Username") === "" &&
    returnEmptyInputErrors(logInInfo.password, "Password") === ""
  );
};
