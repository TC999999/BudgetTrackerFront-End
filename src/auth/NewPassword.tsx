import { useState } from "react";
import {
  PasswordResetInfo,
  PasswordResetErrors,
  PasswordResetFlashErrors,
  ConfirmUserInfo,
  PasswordResetSubmit,
  CurrentStep,
} from "../interfaces/authInterfaces";
import ResetPasswordAPI from "../helpers/ResetPasswordAPI";
import {
  handleConfirmPasswordInputErrors,
  handleConfirmPasswordSubmitErrors,
} from "../helpers/handleNewPasswordErrors";
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";

type Props = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (e: React.FormEvent, newSubmitError: string) => void;
  currentUser: ConfirmUserInfo;
};

// returns window for users to reset their passwords
const NewPassword: React.FC<Props> = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  currentUser,
}): JSX.Element => {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  // Submits data and updates password for user in users db. If there are any errors in the inputs, does
  // not submit data and flashs errorful inputs for user.
  // (e.g. new password length too short, new password contains spaces, confirm password does not match new
  // password)
  const handleSubmit = async (e: React.FormEvent) => {
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
        changeSubmitError(e, "");
        changeLoading(false);
      } else {
        if (formErrors.newPassword || formData.newPassword === "")
          setFlashErrors((flash) => ({ ...flash, newPassword: true }));
        if (formErrors.confirmNewPassword || formData.confirmNewPassword === "")
          setFlashErrors((flash) => ({ ...flash, confirmNewPassword: true }));
        setTimeout(() => {
          setFlashErrors({ newPassword: false, confirmNewPassword: false });
        }, 500);
      }
    } catch (err: any) {
      changeLoading(false);
      changeSubmitError(e, err.message);
    }
  };
  return (
    <div className="create-new-password-div">
      <div className="create-new-password-form">
        <form onSubmit={handleSubmit}>
          <div className="new-password-div">
            <label className="text-lg block" htmlFor="newPassword">
              Input your new password here:{" "}
            </label>
            <input
              type="password"
              className={`userInfo-input ${
                formErrors.newPassword ? "input-error" : "input-valid"
              } ${flashErrors.newPassword && "animate-blinkError"}`}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              placeholder="type your new password here"
              onChange={handleChange}
            />
            {formErrors.newPassword && (
              <div className="username-error text-red-600 font-bold">
                <p>{formErrors.newPassword}</p>
              </div>
            )}
            <div className="text-sm mb-2">
              <p>Your new password must be between 16-20 characters.</p>
            </div>
          </div>
          <div className="confirm-password-div">
            <label className="text-lg block" htmlFor="confirmNewPassword">
              Confirm your new password here
            </label>
            <div className="flex justify-center">
              <input
                type="password"
                className={`userInfo-input ${
                  formErrors.confirmNewPassword ? "input-error" : "input-valid"
                } ${flashErrors.confirmNewPassword && "animate-blinkError"}`}
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                placeholder="type the same new password here"
                onChange={handleChange}
                disabled={
                  !formData.newPassword || formErrors.newPassword.length > 0
                }
              />
              <span className="text-3xl">
                {" "}
                {!formData.newPassword || formErrors.newPassword.length > 0 ? (
                  <GiPadlock className="text-red-800" />
                ) : (
                  <GiPadlockOpen className="text-green-800" />
                )}
              </span>
            </div>
            {formErrors.confirmNewPassword && (
              <div className="username-error text-red-600 font-bold">
                <p>{formErrors.confirmNewPassword}</p>
              </div>
            )}
            <div className="text-sm mb-2">
              <p>Type the same new password you typed above.</p>
            </div>
          </div>
          <div className="submit-button text-center">
            <button className="border-2 text-gray-100 border-green-900 bg-green-500 p-2 rounded-full hover:bg-green-200 hover:text-black duration-150">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
