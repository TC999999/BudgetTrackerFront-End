import { useState, useCallback } from "react";
import {
  SignUpSensitive,
  SignUpSensitiveSubmit,
  SignUpErrors,
  SignUpFlashErrors,
} from "../../interfaces/authInterfaces";
import RegisterAPI from "../../apis/Register";
import {
  handleSignUpInputErrors,
  handleSignUpSubmitErrors,
} from "../../helpers/errorHandlers/handleSignUpErrors";
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

// custom hook for register form for inputting important non-optional data (username, password, email)
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

  const [formData, setFormData] = useState<SignUpSensitive>(initialState);

  const [formErrors, setFormErrors] = useState(initialErrors);
  const [submitError, setSubmitError] = useState<string>("");
  const [flashErrors, setFlashErrors] = useState<SignUpFlashErrors>({
    username: false,
    password: false,
    confirmPassword: false,
    email: false,
  });

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

          await RegisterAPI.createOTP({ username, email });
          handleDataChange(e, { username, password, email });

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
          setTimeout(() => {
            setFlashErrors({
              username: false,
              password: false,
              confirmPassword: false,
              email: false,
            });
          }, 500);
        }
      } catch (err: any) {
        changeSubmitError(err.message, e);
      } finally {
        changeLoading(false);
      }
    },
    [formData, submitError, formErrors, flashErrors]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    handleChange,
    handleSubmit,
  };
};

export default useSignUpSensitive;
