import useSignUpSensitive from "./hooks/useSignUpSensitive";
import { SignUpSensitiveSubmit } from "../interfaces/authInterfaces";
import { step } from "../interfaces/registerInterfaces";
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";

type Props = {
  handleDataChange: (
    e: React.FormEvent,
    newUser: SignUpSensitiveSubmit
  ) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeStep(e: React.FormEvent, newStep: step): void;
  changeSubmitError: (
    newSubmitError: string,
    e: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
};

const SignUpSensitive: React.FC<Props> = ({
  handleDataChange,
  changeLoading,
  changeStep,
  changeSubmitError,
}) => {
  const {
    formData,
    submitError,
    formErrors,
    flashErrors,
    submitErrorFlash,
    handleChange,
    handleSubmit,
  } = useSignUpSensitive({
    handleDataChange,
    changeLoading,
    changeStep,
    changeSubmitError,
  });
  return (
    <div id="sensitive-register-form-div">
      <header>
        <h1 className="text-center text-lg sm:text-3xl text-green-500 font-bold underline">
          Enter Your New Account Information Here
        </h1>
      </header>
      <form onSubmit={handleSubmit}>
        {submitError && (
          <div
            id="register-error"
            className={`text-red-600 text-xl font-bold ${
              submitErrorFlash ? "animate-blinkErrorText" : ""
            }`}
          >
            <p>{submitError}</p>
          </div>
        )}
        <div id="username-div" className="py-4">
          <label className="text-lg block" htmlFor="username">
            Username: <small className="text-red-700">*</small>
          </label>
          <input
            className={`input ${
              formErrors.username ? "input-error" : "input-valid"
            } ${flashErrors.username && "animate-blinkError"}`}
            id="signup_username"
            type="text"
            name="username"
            placeholder="type your username here"
            value={formData.username}
            onChange={handleChange}
          />
          {formErrors.username && (
            <div id="username-error" className="text-red-600 font-bold">
              <p>{formErrors.username}</p>
            </div>
          )}

          <div className="flex flex-col">
            <small>Your username must be between 6-30 characters.</small>
            <small>Your username may include letters and numbers.</small>
            <small>
              Your username cannot contain spaces or special characters
            </small>
            <small>(e.g. !, ?, @, #, () [], /).</small>
          </div>
        </div>
        <div id="password-div" className="py-4">
          <label className="text-lg block" htmlFor="password">
            Password: <small className="text-red-700">*</small>
          </label>
          <input
            className={`input ${
              formErrors.password ? "input-error" : "input-valid"
            } ${flashErrors.password && "animate-blinkError"}`}
            id="signup_password"
            type="password"
            name="password"
            placeholder="type your password here"
            value={formData.password}
            onChange={handleChange}
          />
          {formErrors.password && (
            <div id="password-error" className="text-red-600 font-bold">
              <p>{formErrors.password}</p>
            </div>
          )}
          <div className="flex flex-col">
            <small>Your password must be between 16-20 characters.</small>
            <small>
              Your password may include letters, numbers, and the following
            </small>
            <small>special characters only.</small>
            <small>(!, ?, &, $, #, %).</small>
            <small>
              Your password cannot contain spaces, slashes, or brackets.
            </small>
            <small>(e.g. [], (), /).</small>
          </div>
        </div>
        <div className="confirm-password-div">
          <label className="text-lg block" htmlFor="confirmPassword">
            Confirm your new password here
          </label>
          <div className="flex justify-center">
            <input
              type="password"
              className={`input ${
                formErrors.confirmPassword ? "input-error" : "input-valid"
              } ${flashErrors.confirmPassword && "animate-blinkError"}`}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="type the same new password here"
              onChange={handleChange}
              disabled={!formData.password || formErrors.password.length > 0}
            />
            <span className="text-3xl">
              {!formData.password || formErrors.password.length > 0 ? (
                <GiPadlock className="text-red-800" />
              ) : (
                <GiPadlockOpen className="text-green-800" />
              )}
            </span>
          </div>
          {formErrors.confirmPassword && (
            <div
              id="confirmNewPassword-error"
              className="text-red-600 font-bold"
            >
              <p>{formErrors.confirmPassword}</p>
            </div>
          )}
          <div className="text-sm mb-2">
            <p>Type the same new password you typed above.</p>
          </div>
        </div>
        <div id="email-div" className="py-4">
          <label className="text-lg block" htmlFor="email">
            Email Address: <small className="text-red-700">*</small>
          </label>
          <input
            className={`input ${
              formErrors.email ? "input-error" : "input-valid"
            } ${flashErrors.email && "animate-blinkError"}`}
            id="signup_email"
            type="text"
            name="email"
            placeholder="type your email here"
            value={formData.email}
            onChange={handleChange}
          />
          {formErrors.email && (
            <div className="email-error text-red-600 font-bold">
              <p>{formErrors.email}</p>
            </div>
          )}
          <div className="text-sm">
            <p>Your email address must be valid</p>
          </div>
        </div>
        <div className="text-center">
          <button className="submit-button">Get Verification Code</button>
        </div>
      </form>
    </div>
  );
};

export default SignUpSensitive;
