import { useCallback, useEffect, useState, useRef } from "react";
import { removeUserError } from "../features/slices/authSlice";
import { registerUser } from "../features/actions/auth";
import {
  SignUpInterface,
  SignUpErrors,
  SignUpFlashErrors,
} from "../interfaces/authInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { SubmitIncomeSignUp } from "../interfaces/incomeInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { shallowEqual } from "react-redux";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import NewIncomeWindow from "../incomes/NewIncome";
import SignUpForm from "./SignUpForm";
import { useNavigate, NavigateFunction } from "react-router-dom";
import {
  handleSignUpInputErrors,
  handleSignUpSubmitErrors,
} from "../helpers/handleSignUpErrors";
import { toast, Id } from "react-toastify";

// returns window allowing users to create a new account
const SignUp = (): JSX.Element => {
  const initialState: SignUpInterface = {
    username: "",
    password: "",
    email: "",
    totalAssets: 0,
    incomes: [],
    trusted: true,
  };

  const initialErrors: SignUpErrors = {
    username: "",
    password: "",
    email: "",
  };
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (): Id =>
    toast.error("You have reached the maximum number of allowed incomes!");
  const { error }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  // max value for total assets
  const maxNum = useRef<number>(99999999999999);

  // states for form data values, strings for form errors, and whether to flash errorful inputs to user
  const [formData, setFormData] = useState<SignUpInterface>(initialState);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);
  const [signUpErrors, setSignUpErrors] = useState(initialErrors);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitErrorFlash, setSubmitErrorFlash] = useState<boolean>(false);
  const [FlashErrors, setFlashErrors] = useState<SignUpFlashErrors>({
    username: false,
    password: false,
    email: false,
  });

  // state to show form to add initial incomes
  const [showIncomeForm, setShowIncomeForm] = useState<boolean>(false);

  useEffect((): void => {
    if (error) {
      console.log(error);
      setSubmitError(error);
      dispatch(removeUserError());
    }
    let inputs: string | null = localStorage.getItem("userInputs");
    if (inputs) {
      setFormData(JSON.parse(inputs));
      localStorage.removeItem("userInputs");
    }
  }, [error]);

  // updates form data when user inputs data, if there are any errors in inputs, lets the user know
  // (e.g. username contains spaces betwwen characters, password length too long, email address is invalid)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      if (submitError) setSubmitError("");
      if (name === "username") {
        handleSignUpInputErrors(name, value, setSignUpErrors);
      } else if (name === "password" || name === "email") {
        handleSignUpInputErrors(name, value, setSignUpErrors);
      }
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [formData, signUpErrors, submitError]
  );

  // make for state visible unless income list already has 3 incomes
  const showIncomeFormState = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (formData.incomes.length < 3) {
        setShowIncomeForm(true);
      } else {
        notify();
      }
    },
    [formData, showIncomeForm]
  );

  // update state to make income form invisible
  const changeIncomeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowIncomeForm(!showIncomeForm);
    },
    [showIncomeForm]
  );

  // add new income from form to list of incomes in sign up form data
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

  // remove income from form from list of incomes in sign up form data
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

  // updates form data state when the user checks or unchecks the checkbox that this is a trusted device
  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name } = e.target;
      setFormData((data) => ({ ...data, [name]: e.target.checked }));
    },
    [formData]
  );

  // sends new user info to db and creates a new account for user; automatially logs them in as well. If there
  // are any errors in inputs, does not submit data and flashes errorful inputs. If backend error occurs,
  // returns to this page (e.g. username or email already exist).
  // Additionally, temporarily saves info into localstorage since submitting data causes the page to rerender,
  // so this is used to prevent the information (except password) from being cleared.
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      const { totalAssets } = formData;
      try {
        const signUpInfo: SignUpInterface = {
          ...formData,
          totalAssets: totalAssets / 100,
        };
        if (
          handleSignUpSubmitErrors(signUpInfo, setSignUpErrors) &&
          !submitError
        ) {
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
          if (submitError) setSubmitErrorFlash(true);
          setTimeout(() => {
            setFlashErrors({ username: false, password: false, email: false });
            setSubmitErrorFlash(false);
          }, 500);
        }
      } catch (err: any) {
        // console.log(err);
      }
    },
    [formData, signUpErrors, FlashErrors]
  );

  // when user clicks key on in-app keypad, pushes number clicked onto the formData's totalAssets field and
  // creates a new string, unless the new currency is greater than the allowed max asset value
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

  // removes the rightmost number from the formData's totalAssets string and creates a new string
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
    <main
      id="register-page"
      className="bg-[url('/signUp.jpg')] bg-cover bg-center bg-gray-500 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex flex-start w-full md:inset-0 h-full max-h-full"
    >
      {showIncomeForm && (
        <NewIncomeWindow
          hideIncomeFormState={changeIncomeFormState}
          handleIncomes={handleIncomes}
        />
      )}

      <SignUpForm
        formData={formData}
        signUpErrors={signUpErrors}
        keyPadError={keyPadError}
        flashErrors={FlashErrors}
        submitError={submitError}
        submitErrorFlash={submitErrorFlash}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handlePress={handlePress}
        handleDelete={handleDelete}
        showIncomeFormState={showIncomeFormState}
        removeIncome={removeIncome}
        handleCheckBox={handleCheckBox}
      />
    </main>
  );
};

export default SignUp;
