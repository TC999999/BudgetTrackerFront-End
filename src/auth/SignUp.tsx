import { useCallback, useEffect, useState, useRef } from "react";
import { removeUserError } from "../features/auth/authSlice";
import { registerUser } from "../features/actions/auth";
import {
  SignUpInterface,
  SignUpErrors,
  SignUpFlashErrors,
} from "../interfaces/authInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { SubmitIncomeSignUp } from "../interfaces/incomeInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import KeyPad from "../KeyPad";
import NewIncomeForm from "../incomes/NewIncomeForm";
import SignUpIncomeCard from "../incomes/SignUpIncomeCard";
import { useNavigate } from "react-router-dom";
import {
  handleSignUpInputErrors,
  handleSignUpSubmitErrors,
} from "../helpers/handleSignUpErrors";
import { toast } from "react-toastify";

const SignUp = (): JSX.Element => {
  const initialState: SignUpInterface = {
    username: "",
    password: "",
    email: "",
    totalAssets: 0,
    incomes: [],
  };

  const initialErrors: SignUpErrors = {
    username: "",
    password: "",
    email: "",
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = () =>
    toast.error("You have reached the maximum number of allowed incomes!");
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const [formData, setFormData] = useState<SignUpInterface>(initialState);
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);
  const maxNum = useRef(99999999999999);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);
  const [signUpErrors, setSignUpErrors] = useState(initialErrors);
  const [FlashErrors, setFlashErrors] = useState<SignUpFlashErrors>({
    username: false,
    password: false,
    email: false,
  });

  useEffect(() => {
    if (userStatus.userExists) {
      navigate("/");
    }
    let inputs: string | null = localStorage.getItem("userInputs");
    if (inputs) {
      setFormData(JSON.parse(inputs));
      localStorage.removeItem("userInputs");
    }
  }, [userStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "username") {
      if (userStatus.error) dispatch(removeUserError());
      handleSignUpInputErrors(name, value, setSignUpErrors);
    } else if (name === "password" || name === "email") {
      handleSignUpInputErrors(name, value, setSignUpErrors);
    }
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const showIncomeFormState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if (formData.incomes.length < 5) {
      setShowIncomeForm(true);
    } else {
      notify();
    }
  };

  const changeIncomeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowIncomeForm(!showIncomeForm);
    },
    [showIncomeForm]
  );

  const handleIncomes = useCallback(
    (e: React.FormEvent, income: SubmitIncomeSignUp): void => {
      e.preventDefault();
      setFormData((data) => ({
        ...data,
        incomes: [...formData.incomes, income],
      }));
    },
    [formData.incomes]
  );

  const removeIncome = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      index: number
    ): void => {
      e.preventDefault();
      let newIncomes = formData.incomes.filter((v, i) => {
        if (i !== index) return v;
      });
      setFormData((data) => ({
        ...data,
        incomes: newIncomes,
      }));
    },
    [formData.incomes]
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const { username, password, email, totalAssets, incomes } = formData;
    try {
      const signUpInfo: SignUpInterface = {
        username,
        password,
        email,
        totalAssets: totalAssets / 100,
        incomes,
      };
      if (handleSignUpSubmitErrors(signUpInfo, setSignUpErrors)) {
        localStorage.setItem(
          "userInputs",
          JSON.stringify({ ...formData, password: "" })
        );
        await dispatch(registerUser(signUpInfo)).unwrap();
        localStorage.removeItem("userInputs");
        navigate("/");
      } else {
        if (signUpErrors.username || formData.username === "")
          setFlashErrors((flash) => ({ ...flash, username: true }));
        if (signUpErrors.password || formData.password === "")
          setFlashErrors((flash) => ({ ...flash, password: true }));
        if (signUpErrors.email || formData.email === "")
          setFlashErrors((flash) => ({ ...flash, email: true }));
        setTimeout(() => {
          setFlashErrors({ username: false, password: false, email: false });
        }, 500);
      }
    } catch (err) {}
  };

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.totalAssets, num);
      if (newNum > maxNum.current) {
        setKeyPadError(true);
      } else {
        setFormData((data) => ({ ...data, totalAssets: newNum }));
      }
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.totalAssets);
      setFormData((data) => ({
        ...data,
        totalAssets: newNum,
      }));
      if (keyPadError) {
        setKeyPadError(false);
      }
    },
    [formData, keyPadError]
  );

  return (
    <main className="register-page bg-[url('/signUp.jpg')] bg-cover bg-center bg-gray-500 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex flex-start w-full md:inset-0 h-full max-h-full">
      <div className="register-form px-4 py-2 bg-white border-2 border-green-700 rounded-r-lg h-full max-h-full overflow-auto">
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
        </header>
        <div className="form-div">
          {showIncomeForm && (
            <NewIncomeForm
              hideIncomeFormState={changeIncomeFormState}
              handleIncomes={handleIncomes}
            />
          )}
          <form onSubmit={handleSubmit}>
            <div className="username-div py-4">
              <label className="text-lg block" htmlFor="username">
                Username:{" "}
              </label>
              <input
                className={`input 
                ${
                  signUpErrors.username || userStatus.error
                    ? "input-error"
                    : "input-valid"
                } ${FlashErrors.username && "animate-blinkError"}`}
                id="signup_username"
                type="text"
                name="username"
                placeholder="type your username here"
                value={formData.username}
                onChange={handleChange}
              />
              {signUpErrors.username && (
                <div className="username-error text-red-600 font-bold">
                  <p>{signUpErrors.username}</p>
                </div>
              )}
              {typeof userStatus.error === "string" && (
                <div className="username-error text-red-600 font-bold">
                  <p>{userStatus.error}</p>
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
            <div className="password-div py-4">
              <label className="text-lg block" htmlFor="password">
                Password:{" "}
              </label>
              <input
                className={`input ${
                  signUpErrors.password ? "input-error" : "input-valid"
                } ${FlashErrors.password && "animate-blinkError"}`}
                id="signup_password"
                type="password"
                name="password"
                placeholder="type your password here"
                value={formData.password}
                onChange={handleChange}
              />
              {signUpErrors.password && (
                <div className="password-error text-red-600 font-bold">
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
            <div className="email-div py-4">
              <label className="text-lg block" htmlFor="email">
                Email Address:{" "}
              </label>
              <input
                className={`input-email 
                ${signUpErrors.email ? "input-error" : "input-valid"} ${
                  FlashErrors.email && "animate-blinkError"
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
            <div className="total-assets-div py-4">
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
            <div className="keyPad-div flex justify-center m-5">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.totalAssets}
              />
            </div>
            <section className="incomes-section">
              <header>
                <h1 className="text-lg block">
                  Incomes ({formData.incomes.length}/5):
                </h1>
              </header>
              <div className="new-income-list">
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
              <div className="add-income-button">
                <button
                  className={`bg-green-600 p-2 m-2 border-2 border-green-600 rounded-full text-white ${
                    formData.incomes.length < 5
                      ? "hover:bg-green-300 hover:text-black active:bg-green-600"
                      : "cursor-not-allowed"
                  } `}
                  onClick={(e) => showIncomeFormState(e)}
                >
                  Add an Income
                </button>
              </div>
            </section>
            <div className="button-div text-center">
              <button className="make-profile-button border-2 rounded-full border-green-500 bg-green-500 text-white  py-2 px-4 hover:bg-green-200 hover:text-black duration-150 active:bg-green-400">
                Sign Up!
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
