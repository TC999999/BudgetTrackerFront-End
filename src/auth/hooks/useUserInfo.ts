import { useState, useCallback } from "react";
import {
  ConfirmUserInfo,
  CurrentStep,
  UserInfoErrors,
  UserInfoFlashErrors,
} from "../../interfaces/authInterfaces";
import ResetPasswordAPI from "../../apis/ResetPasswordAPI";
import {
  handleUserInfoInputErrors,
  handleUserInfoSubmitErrors,
} from "../../helpers/errorHandlers/handleUserInfoErrors";

type input = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (newSubmitError: string, e: React.FormEvent) => void;
  changeUser: (e: React.FormEvent, newUser: ConfirmUserInfo) => void;
};

// custom hook for submitting user info before resetting password: includes changing data in state and
// submitting data
const useUserInfo = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  changeUser,
}: input) => {
  // initial state for confirm user info
  const initialState: ConfirmUserInfo = {
    username: "",
    email: "",
  };
  // initial error strings for confirming user info
  const initialErrors: UserInfoErrors = {
    username: "",
    email: "",
  };

  // states for form data values, strings for form errors, and whether to flash errorful inputs to user
  const [formData, setFormData] = useState<ConfirmUserInfo>(initialState);
  const [formErrors, setFormErrors] = useState<UserInfoErrors>(initialErrors);
  const [flashErrors, setFlashErrors] = useState<UserInfoFlashErrors>({
    username: false,
    email: false,
  });

  // changes form data, if there are any errors in user input, the error object state is updated and shown to
  // the user
  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      let { name, value } = e.target;
      if (name === "username" || name === "email") {
        handleUserInfoInputErrors(name, value, setFormErrors);
        setFormData((data) => ({ ...data, [name]: value }));
      }
    },
    [formData, formErrors]
  );

  // checks if inputted user data matches what's in db and makes a request
  // for a one time verification code. If an error is found in the inputs, the data
  // is not submitted and the errorful inputs flash red
  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      try {
        if (handleUserInfoSubmitErrors(formData, setFormErrors)) {
          changeLoading(true);
          let res: ConfirmUserInfo = await ResetPasswordAPI.confirmUserInfo(
            formData
          );
          changeStep(e, "oneTimeCode");
          changeSubmitError("", e);
          changeUser(e, res);
          changeLoading(false);
        } else {
          if (formErrors.username || formData.username === "")
            setFlashErrors((flash) => ({ ...flash, username: true }));
          if (formErrors.email || formData.email === "")
            setFlashErrors((flash) => ({ ...flash, email: true }));
          setTimeout(() => {
            setFlashErrors({ username: false, email: false });
          }, 500);
        }
      } catch (err: any) {
        changeLoading(false);
        changeSubmitError(err.message, e);
      }
    },
    [formData, formErrors, flashErrors]
  );

  return {
    formData,
    formErrors,
    flashErrors,
    handleChange,
    handleSubmit,
  };
};

export default useUserInfo;
