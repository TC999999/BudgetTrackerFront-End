import useSignUpSensitive from "./hooks/useSignUpSensitive";
import { SignUpSensitiveSubmit } from "../interfaces/authInterfaces";
import { step } from "../interfaces/registerInterfaces";
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";
import AuthTabs from "../motionWrappers/AuthTabs";

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
  show: boolean;
  mockSubmit?: any;
};

// window for register form for users to input non-optional information (username, password, email)
const SignUpSensitive: React.FC<Props> = ({
  handleDataChange,
  changeLoading,
  changeStep,
  changeSubmitError,
  show,
  mockSubmit,
}) => {
  const { formData, formErrors, flashErrors, handleChange, handleSubmit } =
    useSignUpSensitive({
      handleDataChange,
      changeLoading,
      changeStep,
      changeSubmitError,
      mockSubmit,
    });
  return (
    <AuthTabs show={show}>
      <header className="text-center">
        <h1 className="text-lg sm:text-3xl text-green-500 font-bold underline">
          Enter Your New Account Information Here
        </h1>
        <h2 className="text-md sm:text-lg italic">
          Afterwards, we will send an email to the provided address with a
          verification code that you will have to input to create your account.
        </h2>
        <small>
          (<span className="text-red-700">*</span>: <i>required</i>)
        </small>
      </header>
      <form onSubmit={handleSubmit}>
        <div id="username-div" className="py-4">
          <label className="text-lg block" htmlFor="username">
            Username: <small className="text-red-700">*</small>
          </label>
          <input
            className={`input ${
              formErrors.username ? "input-error" : "input-valid"
            } ${flashErrors.username && "animate-blink-error"}`}
            id="username"
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
            } ${flashErrors.password && "animate-blink-error"}`}
            id="password"
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
            Confirm your password here:{" "}
            <small className="text-red-700">*</small>
          </label>
          <div className="flex justify-center items-center">
            <input
              type="password"
              className={`input ${
                formErrors.confirmPassword ? "input-error" : "input-valid"
              } ${flashErrors.confirmPassword && "animate-blink-error"}`}
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
            } ${flashErrors.email && "animate-blink-error"}`}
            id="email"
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
    </AuthTabs>
  );
};

export default SignUpSensitive;
