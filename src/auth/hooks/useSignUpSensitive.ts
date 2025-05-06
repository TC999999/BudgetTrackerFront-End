import { useEffect, useState, useCallback } from "react";
import { removeUserError } from "../../features/slices/authSlice";
import {
  SignUpSensitive,
  SignUpSensitiveSubmit,
  SignUpErrors,
  SignUpFlashErrors,
} from "../../interfaces/authInterfaces";
import RegisterAPI from "../../apis/Register";
import { UserContextInterface } from "../../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { shallowEqual } from "react-redux";
import {
  handleSignUpInputErrors,
  handleSignUpSubmitErrors,
} from "../../helpers/handleSignUpErrors";
import { step } from "../../interfaces/registerInterfaces";

type input = {
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

const useSignUpSensitive = ({
  handleDataChange,
  changeLoading,
  changeStep,
  changeSubmitError,
}: input) => {
  const initialState: SignUpSensitive = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  };

  const initialErrors: SignUpErrors = {
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  };
  const dispatch: AppDispatch = useAppDispatch();

  const { error }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const [formData, setFormData] = useState<SignUpSensitive>(initialState);

  const [formErrors, setFormErrors] = useState(initialErrors);
  const [submitError, setSubmitError] = useState<string>("");
  const [submitErrorFlash, setSubmitErrorFlash] = useState<boolean>(false);
  const [flashErrors, setFlashErrors] = useState<SignUpFlashErrors>({
    username: false,
    password: false,
    confirmPassword: false,
    email: false,
  });

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
      if (name === "username" || name === "password" || name === "email") {
        handleSignUpInputErrors(name, value, setFormErrors);
      } else if (name === "confirmPassword") {
        handleSignUpInputErrors(name, value, setFormErrors, formData.password);
      }
      setFormData((data) => ({ ...data, [name]: value }));
    },
    [submitError, formErrors, formData]
  );

  // sends new user info to db and creates a new account for user; automatially logs them in as well. If there
  // are any errors in inputs, does not submit data and flashes errorful inputs. If backend error occurs,
  // returns to this page (e.g. username or email already exist).
  // Additionally, temporarily saves info into localstorage since submitting data causes the page to rerender,
  // so this is used to prevent the information (except password) from being cleared.
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleSignUpSubmitErrors(formData, setFormErrors) && !submitError) {
          changeLoading(true);
          const { username, password, email } = formData;
          localStorage.setItem(
            "userInputs",
            JSON.stringify({ ...formData, password: "", confirmPassword: "" })
          );

          await RegisterAPI.createOTP({ username, email });
          handleDataChange(e, { username, password, email });
          localStorage.removeItem("userInputs");
          changeStep(e, "showOTPForm");
        } else {
          if (formErrors.username || formData.username === "")
            setFlashErrors((flash) => ({ ...flash, username: true }));
          if (formErrors.password || formData.password === "")
            setFlashErrors((flash) => ({ ...flash, password: true }));
          if (formErrors.confirmPassword || formData.confirmPassword === "")
            setFlashErrors((flash) => ({ ...flash, confirmPassword: true }));
          if (formErrors.email || formData.email === "")
            setFlashErrors((flash) => ({ ...flash, email: true }));
          if (submitError) setSubmitErrorFlash(true);
          setTimeout(() => {
            setFlashErrors({
              username: false,
              password: false,
              confirmPassword: false,
              email: false,
            });
            setSubmitErrorFlash(false);
          }, 500);
        }
      } catch (err: any) {
        changeSubmitError(err.message, e);
      } finally {
        changeLoading(false);
      }
    },
    [formData, submitError, formErrors, flashErrors, submitErrorFlash]
  );

  return {
    formData,
    submitError,
    formErrors,
    flashErrors,
    submitErrorFlash,
    handleChange,
    handleSubmit,
  };
};

export default useSignUpSensitive;
