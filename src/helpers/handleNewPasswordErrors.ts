import {
  PasswordResetInfo,
  PasswordResetErrors,
} from "../interfaces/authInterfaces";

// returns custom strings for input errors for new password form password input
const returnNewPasswordErrors = (newPassword: string): string => {
  if (newPassword.length === 0) {
    return "New Password is Empty.";
  } else if (!/^[\w!?&$#%]+$/i.test(newPassword)) {
    return "Password input contains invalid characters.";
  } else if (newPassword.length > 20) {
    return "New Password is too long.";
  } else if (newPassword.length < 16 && newPassword.length > 0) {
    return "New Password is too short.";
  }
  return "";
};

// returns custom strings for input errors for new password form confirmation input
const returnConfirmPasswordErrors = (
  newPassword: string,
  confirmNewPassword: string
): string => {
  if (confirmNewPassword === "") {
    return "New password confirmation cannot be empty";
  } else if (confirmNewPassword !== newPassword) {
    return "Does not match new password above!";
  }
  return "";
};

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
        newPassword: returnNewPasswordErrors(newPassword),
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
    returnNewPasswordErrors(newPasswordInfo.newPassword) === "" &&
    returnConfirmPasswordErrors(
      newPasswordInfo.newPassword,
      newPasswordInfo.confirmNewPassword
    ) === ""
  );
};
