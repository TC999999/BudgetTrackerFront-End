import {
  PasswordResetInfo,
  PasswordResetErrors,
} from "../../interfaces/authInterfaces";
import {
  returnPasswordErrors,
  returnConfirmPasswordErrors,
} from "./commonHandlers";

// updates new password form error state when input values change
export const handleConfirmPasswordInputErrors = (
  name: "newPassword" | "confirmNewPassword",
  newPassword: string,
  setter: React.Dispatch<React.SetStateAction<PasswordResetErrors>>,
  confirmNewPassword?: string
): void => {
  switch (name) {
    case "newPassword":
      setter((data) => ({
        ...data,
        newPassword: returnPasswordErrors(newPassword),
      }));
      break;
    case "confirmNewPassword":
      setter((data) => ({
        ...data,
        confirmNewPassword: returnConfirmPasswordErrors(
          newPassword,
          confirmNewPassword!
        ),
      }));
      break;
  }
};

// updates new password form error state when form is submitted; returns true if all inputs are error free
export const handleConfirmPasswordSubmitErrors = (
  newPasswordInfo: PasswordResetInfo,
  setter: React.Dispatch<React.SetStateAction<PasswordResetErrors>>
): boolean => {
  handleConfirmPasswordInputErrors(
    "newPassword",
    newPasswordInfo.newPassword,
    setter
  );

  handleConfirmPasswordInputErrors(
    "confirmNewPassword",
    newPasswordInfo.newPassword,
    setter,
    newPasswordInfo.confirmNewPassword
  );

  return (
    returnPasswordErrors(newPasswordInfo.newPassword) === "" &&
    returnConfirmPasswordErrors(
      newPasswordInfo.newPassword,
      newPasswordInfo.confirmNewPassword
    ) === ""
  );
};
