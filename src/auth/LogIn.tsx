import { Link } from "react-router-dom";
import useLogIn from "./hooks/useLogIn";
import { motion } from "motion/react";

type Props = {
  onSubmit?: any;
};

// form for logging in a user
const LogIn: React.FC<Props> = ({ onSubmit }): JSX.Element => {
  const {
    formData,
    formErrors,
    flashErrors,
    submitError,
    submitErrorFlash,
    handleChange,
    handleCheckBox,
    handleSubmit,
  } = useLogIn();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    } else {
      handleSubmit(e);
    }
  };
  return (
    <div
      tabIndex={-1}
      className="login-page-div bg-gray-500 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="login-page relative w-full p-4 max-w-md max-h-full"
      >
        <div className="login-form relative p-10 bg-gray-100 rounded-lg shadow-sm border-2 border-green-900 px-2 py-2 w-full">
          <h1 className="text-3xl font-bold underline text-green-900 text-center">
            Log in Here!
          </h1>
          <form onSubmit={submit}>
            <div className="username-div">
              <label className="text-lg block" htmlFor="username">
                Username:
              </label>
              <input
                className={`input 
                ${formErrors.username ? "input-error" : "input-valid"} ${
                  flashErrors.username && "animate-blink-error"
                }`}
                id="login_username"
                type="text"
                name="username"
                placeholder="type your username here"
                value={formData.username}
                onChange={handleChange}
                maxLength={30}
              />
              {formErrors.username && (
                <div className="username-error text-red-600 font-bold">
                  <p>{formErrors.username}</p>
                </div>
              )}
            </div>
            <div className="password-div">
              <label className="text-lg block" htmlFor="password">
                Password:
              </label>
              <input
                className={`input 
                  ${formErrors.password ? "input-error" : "input-valid"} ${
                  flashErrors.password && "animate-blink-error"
                }`}
                id="login_password"
                type="password"
                name="password"
                placeholder="type your password here"
                value={formData.password}
                onChange={handleChange}
                maxLength={20}
              />
              {formErrors.password && (
                <div className="password-error text-red-600 font-bold">
                  <p>{formErrors.password}</p>
                </div>
              )}
            </div>
            <div id="trusted-div" className="text-center">
              <div className="flex justify-center">
                <div className="flex items-center">
                  <label className="text-lg" htmlFor="trusted">
                    Do You Trust This Device?
                    <input
                      className="form-checkbox checkbox checkbox-add"
                      id="login_trusted"
                      type="checkbox"
                      name="trusted"
                      checked={formData.trusted}
                      onChange={handleCheckBox}
                    />
                  </label>
                </div>
              </div>
              <small>
                (You will have a longer access session on trusted devices.)
              </small>
            </div>
            <div className="button-div text-center m-2">
              <button
                id="get-profile-button"
                className="border-2 border-green-500 rounded-full bg-green-400 p-2 hover:bg-green-900 hover:text-white"
              >
                Log In!
              </button>
            </div>
            {submitError && (
              <div
                className={`error-message text-center text-red-500 text-xl font-bold ${
                  submitErrorFlash ? "animate-blink-error-text" : ""
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
      </motion.div>
    </div>
  );
};

export default LogIn;
