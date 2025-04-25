import {
  LogInInterface,
  LogInErrors,
  LogInFlashErrors,
} from "../interfaces/authInterfaces";
import { Link } from "react-router-dom";

type Props = {
  formData: LogInInterface;
  logInErrors: LogInErrors;
  flashErrors: LogInFlashErrors;
  submitError: string;
  submitErrorFlash: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// form for logging in a user
const LogInForm: React.FC<Props> = ({
  formData,
  logInErrors,
  flashErrors,
  submitError,
  submitErrorFlash,
  handleChange,
  handleSubmit,
  handleCheckBox,
}) => {
  return (
    <div
      tabIndex={-1}
      className="login-page-div bg-gray-500 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full"
    >
      <div className="login-page relative w-full p-4 max-w-md max-h-full">
        <div className="login-form relative p-10 bg-gray-100 rounded-lg shadow-sm border-2 border-green-900 px-2 py-2 w-full">
          <h1 className="text-3xl font-bold underline">Log in Here!</h1>
          <form onSubmit={handleSubmit}>
            <div className="username-div">
              <label className="text-lg block" htmlFor="username">
                Username:
              </label>
              <input
                className={`input 
                ${logInErrors.username ? "input-error" : "input-valid"} ${
                  flashErrors.username && "animate-blinkError"
                }`}
                id="login_username"
                type="text"
                name="username"
                placeholder="type your username here"
                value={formData.username}
                onChange={handleChange}
                maxLength={30}
              />
              {logInErrors.username && (
                <div className="username-error text-red-600 font-bold">
                  <p>{logInErrors.username}</p>
                </div>
              )}
            </div>
            <div className="password-div">
              <label className="text-lg block" htmlFor="password">
                Password:
              </label>
              <input
                className={`input 
                  ${logInErrors.password ? "input-error" : "input-valid"} ${
                  flashErrors.password && "animate-blinkError"
                }`}
                id="login_password"
                type="password"
                name="password"
                placeholder="type your password here"
                value={formData.password}
                onChange={handleChange}
                maxLength={20}
              />
              {logInErrors.password && (
                <div className="password-error text-red-600 font-bold">
                  <p>{logInErrors.password}</p>
                </div>
              )}
            </div>
            <div id="trusted-div" className="text-center">
              <div className="flex justify-center">
                <div className="flex items-center">
                  <input
                    className="form-checkbox checkbox checkbox-add"
                    id="login_trusted"
                    type="checkbox"
                    name="trusted"
                    checked={formData.trusted}
                    onChange={handleCheckBox}
                  />
                  <label className="text-lg" htmlFor="trusted">
                    Do You Trust This Device?
                  </label>
                </div>
              </div>
              <small>
                (You will have a longer access session on trusted devices.)
              </small>
            </div>
            <div className="button-div text-center m-2">
              <button className="get-profile-button border-2 border-green-500 rounded-full bg-green-400 p-2 hover:bg-green-900 hover:text-white">
                Log In!
              </button>
            </div>
            {submitError && (
              <div
                className={`error-message text-center text-red-500 text-xl font-bold ${
                  submitErrorFlash ? "animate-blinkErrorText" : ""
                }`}
              >
                <p>{submitError}</p>
              </div>
            )}
          </form>
        </div>
        <div id="alternate-links" className="text-center">
          <p>
            Not a user yet?{" "}
            <Link
              className="text-blue-900 hover:text-blue-500 hover:underline active:text-blue-300"
              to="/register"
            >
              Sign Up Here!
            </Link>
          </p>

          <p>
            Forget your password?{" "}
            <Link
              className="text-blue-900 hover:text-blue-500 hover:underline active:text-blue-300"
              to="/resetPassword"
            >
              Reset Your Password Here!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInForm;
