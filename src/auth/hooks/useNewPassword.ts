import { useState, useCallback } from "react";
import {
  PasswordResetInfo,
  PasswordResetErrors,
  PasswordResetFlashErrors,
  PasswordResetSubmit,
  PasswordResetInput,
} from "../../interfaces/authInterfaces";
import ResetPasswordAPI from "../../apis/ResetPasswordAPI";
import {
  handleConfirmPasswordInputErrors,
  handleConfirmPasswordSubmitErrors,
} from "../../helpers/errorHandlers/handleNewPasswordErrors";

// custom hook for creating a new password after verifying the code: includes changes in input, and submitting
// data
const useNewPassword = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  currentUser,
}: PasswordResetInput) => {
  // initial data for resetting password;
  //    newPassword: the user's new password
  //    confirmPassword: if the user's new password is valid, type the new password again to confirm
  const initialState: PasswordResetInfo = {
    newPassword: "",
    confirmNewPassword: "",
  };

  // error strings for if reset password inputs contain errors
  const initialErrors: PasswordResetErrors = {
    newPassword: "",
    confirmNewPassword: "",
  };

  // booleans for if reset password inputs contain errors on submitting form
  const initialFlashErrors: PasswordResetFlashErrors = {
    newPassword: false,
    confirmNewPassword: false,
  };

  // states for form data values, strings for form errors, and whether to flash errorful inputs to user
  const [formData, setFormData] = useState<PasswordResetInfo>(initialState);
  const [formErrors, setFormErrors] =
    useState<PasswordResetErrors>(initialErrors);
  const [flashErrors, setFlashErrors] =
    useState<PasswordResetFlashErrors>(initialFlashErrors);

  // changes form data state, if there are any errors in the inputs, updates error state and lets the user know
  // (e.g. new password length too short, new password contains spaces, confirm password does not match new
  // password)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "newPassword") {
        handleConfirmPasswordInputErrors(name, value, setFormErrors);
      } else if (name === "confirmNewPassword") {
        handleConfirmPasswordInputErrors(
          name,
          formData.newPassword,
          setFormErrors,
          value
        );
      }
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [formData, formErrors]
  );

  // Submits data and updates password for user in users db. If there are any errors in the inputs, does
  // not submit data and flashs errorful inputs for user.
  // (e.g. new password length too short, new password contains spaces, confirm password does not match new
  // password)
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        if (handleConfirmPasswordSubmitErrors(formData, setFormErrors)) {
          changeLoading(true);
          let submitData: PasswordResetSubmit = {
            username: currentUser.username,
            email: currentUser.email,
            newPassword: formData.newPassword,
          };
          await ResetPasswordAPI.resetPassword(submitData);
          changeStep(e, "success");
          changeSubmitError("", e);
          changeLoading(false);
        } else {
          if (formErrors.newPassword || formData.newPassword === "")
            setFlashErrors((flash) => ({ ...flash, newPassword: true }));
          if (
            formErrors.confirmNewPassword ||
            formData.confirmNewPassword === ""
          )
            setFlashErrors((flash) => ({ ...flash, confirmNewPassword: true }));
          setTimeout(() => {
            setFlashErrors({ newPassword: false, confirmNewPassword: false });
          }, 500);
        }
      } catch (err: any) {
        changeLoading(false);
        changeSubmitError(err.message, e);
      }
    },
    [formData, formErrors, flashErrors]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    handleChange,
    handleSubmit,
  };
};

export default useNewPassword;
