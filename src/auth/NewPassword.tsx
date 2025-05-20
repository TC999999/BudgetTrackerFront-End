import { PasswordResetInput } from "../interfaces/authInterfaces";
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";
import useNewPassword from "./hooks/useNewPassword";
import AuthTabs from "../motionWrappers/AuthTabs";

// returns window for users to reset their passwords
const NewPassword: React.FC<PasswordResetInput> = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  currentUser,
  show,
}): JSX.Element => {
  const { formData, formErrors, flashErrors, handleChange, handleSubmit } =
    useNewPassword({
      changeStep,
      changeLoading,
      changeSubmitError,
      currentUser,
    });

  return (
    <AuthTabs show={show}>
      <div id="create-new-password-form">
        <form onSubmit={handleSubmit}>
          <div id="new-password-div">
            <label className="text-lg block" htmlFor="newPassword">
              Input your new password here:{" "}
            </label>
            <input
              type="password"
              className={`userInfo-input ${
                formErrors.newPassword ? "input-error" : "input-valid"
              } ${flashErrors.newPassword && "animate-blink-error"}`}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              placeholder="type your new password here"
              onChange={handleChange}
            />
            {formErrors.newPassword && (
              <div id="newPassword-error" className="text-red-600 font-bold">
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
                } ${flashErrors.confirmNewPassword && "animate-blink-error"}`}
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
              <div
                id="confirmNewPassword-error"
                className="text-red-600 font-bold"
              >
                <p>{formErrors.confirmNewPassword}</p>
              </div>
            )}
            <div className="text-sm mb-2">
              <p>Type the same new password you typed above.</p>
            </div>
          </div>
          <div id="submit-button" className="text-center">
            <button className="border-2 text-gray-100 border-green-900 bg-green-500 p-2 rounded-full hover:bg-green-200 hover:text-black duration-150">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </AuthTabs>
  );
};

export default NewPassword;
