import { useNavigate, NavigateFunction } from "react-router-dom";
import KeyPad from "../KeyPad";
import SignUpIncomeCard from "../incomes/SignUpIncomeCard";
import {
  SignUpInterface,
  SignUpErrors,
  SignUpFlashErrors,
} from "../interfaces/authInterfaces";

type Props = {
  formData: SignUpInterface;
  signUpErrors: SignUpErrors;
  keyPadError: boolean;
  flashErrors: SignUpFlashErrors;
  submitError: string;
  submitErrorFlash: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePress: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  showIncomeFormState: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  removeIncome: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => void;
  handleCheckBox: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// form for a new user to register their account
const SignUpForm: React.FC<Props> = ({
  formData,
  signUpErrors,
  keyPadError,
  flashErrors,
  submitError,
  submitErrorFlash,
  handleChange,
  handleSubmit,
  handlePress,
  handleDelete,
  showIncomeFormState,
  removeIncome,
  handleCheckBox,
}): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  return (
    <div
      id="register-form"
      className="px-4 py-2 bg-white border-2 border-green-700 rounded-r-lg h-full max-h-full overflow-auto"
    >
      <button
        className="border border-gray-200 p-2 rounded-full bg-gray-400 shadow hover:bg-gray-200 transition-150 active:bg-gray-300"
        onClick={() => navigate("/")}
      >
        Go Back
      </button>
      <header>
        <h1 className="text-3xl font-bold underline text-emerald-600">
          Sign Up Here!
        </h1>
        <small>
          (<span className="text-red-700">*</span>: <i>required</i>)
        </small>
      </header>
      <div id="register-form-div">
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
              className={`input 
          ${signUpErrors.username ? "input-error" : "input-valid"} ${
                flashErrors.username && "animate-blinkError"
              }`}
              id="signup_username"
              type="text"
              name="username"
              placeholder="type your username here"
              value={formData.username}
              onChange={handleChange}
            />
            {signUpErrors.username && (
              <div id="username-error" className="text-red-600 font-bold">
                <p>{signUpErrors.username}</p>
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
                signUpErrors.password ? "input-error" : "input-valid"
              } ${flashErrors.password && "animate-blinkError"}`}
              id="signup_password"
              type="password"
              name="password"
              placeholder="type your password here"
              value={formData.password}
              onChange={handleChange}
            />
            {signUpErrors.password && (
              <div id="password-error" className="text-red-600 font-bold">
                <p>{signUpErrors.password}</p>
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
          <div id="email-div" className="py-4">
            <label className="text-lg block" htmlFor="email">
              Email Address: <small className="text-red-700">*</small>
            </label>
            <input
              className={`input 
          ${signUpErrors.email ? "input-error" : "input-valid"} ${
                flashErrors.email && "animate-blinkError"
              }`}
              id="signup_email"
              type="text"
              name="email"
              placeholder="type your email here"
              value={formData.email}
              onChange={handleChange}
            />
            {signUpErrors.email && (
              <div className="email-error text-red-600 font-bold">
                <p>{signUpErrors.email}</p>
              </div>
            )}
            <div className="text-sm">
              <p>Your email address must be valid</p>
            </div>
          </div>
          <div id="total-assets-div" className="py-4">
            <label className="text-lg block" htmlFor="moneyAllocated">
              Total Assets: ($ U.S.):{" "}
            </label>
            <input
              className="input"
              id="total_assets"
              type="text"
              name="totalAssets"
              placeholder="0.00"
              value={`$${(formData.totalAssets / 100).toFixed(2)}`}
              onChange={handleChange}
              readOnly
            />
            <small>
              Your total assets must between $999999999999.99 and $0.00
            </small>
            {keyPadError && (
              <div className="text-green-700 font-bold text-sm">
                <p>You've reached the maximum asset value.</p>
              </div>
            )}
          </div>
          <div id="keyPad-div" className="flex justify-center m-5">
            <KeyPad
              handlePress={handlePress}
              handleDelete={handleDelete}
              num={formData.totalAssets}
            />
          </div>
          <section id="incomes-section">
            <header>
              <h1 className="text-lg block">
                Incomes ({formData.incomes.length}/3):
              </h1>
            </header>
            <div id="new-income-list">
              {formData.incomes.length ? (
                formData.incomes.map((i, index) => (
                  <SignUpIncomeCard
                    key={`new-income-${index}`}
                    income={i}
                    removeIncome={removeIncome}
                    index={index}
                  />
                ))
              ) : (
                <i>No Incomes</i>
              )}
            </div>
            <div id="add-income-button">
              <button
                className={`bg-green-600 p-2 m-2 border-2 border-green-600 rounded-full text-white ${
                  formData.incomes.length < 3
                    ? "hover:bg-green-300 hover:text-black active:bg-green-600"
                    : "cursor-not-allowed"
                } `}
                onClick={(e) => showIncomeFormState(e)}
              >
                Add an Income
              </button>
            </div>
            <div id="trusted-div" className="text-center m-2">
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
          </section>
          <div id="button-div" className="text-center">
            <button
              id="make-profile-button"
              className="border-2 rounded-full border-green-500 bg-green-500 text-white py-2 px-4 hover:bg-green-200 hover:text-black duration-150 active:bg-green-400"
            >
              Sign Up!
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
