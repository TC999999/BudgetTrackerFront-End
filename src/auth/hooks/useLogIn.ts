import { useState, useEffect, useCallback } from "react";
import { removeUserError } from "../../features/slices/authSlice";
import { logInUser } from "../../features/actions/auth";
import {
  LogInInterface,
  LogInErrors,
  LogInFlashErrors,
} from "../../interfaces/authInterfaces";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import {
  handleLogInInputErrors,
  handleLogInSubmitErrors,
} from "../../helpers/errorHandlers/handleLogInErrors";
import { shallowEqual } from "react-redux";

// custom hook for logging in a user: includes error handler, handler for updating state when the input changes, and
// a handler for submitting the data
const useLogIn = () => {
  const initialState: LogInInterface = {
    username: "",
    password: "",
    trusted: true,
  };
  const initialErrors: LogInErrors = {
    username: "",
    password: "",
  };
  const dispatch: AppDispatch = useAppDispatch();
  const [formData, setFormData] = useState<LogInInterface>(initialState);
  const [formErrors, setFormErrors] = useState<LogInErrors>(initialErrors);
  const [submitError, setSubmitError] = useState<string>("");
  const [flashErrors, setFlashErrors] = useState<LogInFlashErrors>({
    username: false,
    password: false,
  });
  const [submitErrorFlash, setSubmitErrorFlash] = useState<boolean>(false);

  // this is used to grab an error for invalid username/password
  const { error }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  // since submitting the login form causes a rerender, we store the inputted information into localstorage
  // and grab it after the rerender and sets the form data
  useEffect((): void => {
    let inputs: string | null = localStorage.getItem("userInputs");
    if (error) {
      setSubmitError(error);
      dispatch(removeUserError());
    }
    if (inputs) {
      setFormData(JSON.parse(inputs));
      localStorage.removeItem("userInputs");
    }
  }, []);

  // handles changes to login form, if user makes any errors while inputting data, the frontend lets them know
  // Additionally, if the redux user status has an error, removes that error.
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (submitError) setSubmitError("");
      const { name, value } = e.target;
      if (name === "username" || name === "password")
        handleLogInInputErrors(name, value, setFormErrors);
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [submitError, formData, formErrors]
  );

  // updates form data state when the user checks or unchecks the checkbox that this is a trusted device
  const handleCheckBox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name } = e.target;
      setFormData((data) => ({ ...data, [name]: e.target.checked }));
    },
    [formData]
  );

  // submits login information and retrieves user data. If there are any errors in the inputs (username has
  // spaces between characters or password length too short), does not submit data and the errorful inputs
  // flash red.
  // Additionally, temporarily sets username info into local storage in case username and password is invalid since
  // submitting login form causes page to rerender and formdata to clear so user does not need to reenter
  // username.
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        const logInInfo: LogInInterface = {
          ...formData,
        };
        if (handleLogInSubmitErrors(logInInfo, setFormErrors) && !submitError) {
          localStorage.setItem(
            "userInputs",
            JSON.stringify({ ...formData, password: "" })
          );
          await dispatch(logInUser(logInInfo));
          localStorage.removeItem("userInputs");
        } else {
          if (submitError) setSubmitErrorFlash(true);
          if (formErrors.username || formData.username === "")
            setFlashErrors((flash) => ({ ...flash, username: true }));
          if (formErrors.password || formData.password === "")
            setFlashErrors((flash) => ({ ...flash, password: true }));
          setTimeout(() => {
            setFlashErrors({ username: false, password: false });
            setSubmitErrorFlash(false);
          }, 500);
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    [submitError, formData, formErrors, flashErrors, submitErrorFlash]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    submitError,
    submitErrorFlash,
    handleChange,
    handleCheckBox,
    handleSubmit,
  };
};

export default useLogIn;
