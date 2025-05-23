import RegisterAPI from "../../apis/Register";
import { useState, useCallback } from "react";
import {
  OneTimeCodeFormData,
  OneTimeCodeSelect,
  OneTimeCodeData,
  digits,
  SignUpInterface,
} from "../../interfaces/authInterfaces";
import { joinOTPCode } from "../../helpers/joinOTPCode";
import { step } from "../../interfaces/registerInterfaces";

type input = {
  changeLoading: (loadingStatus: boolean) => void;
  changeStep(e: React.FormEvent, newStep: step): void;
  changeSubmitError: (
    newSubmitError: string,
    e: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  registerData: SignUpInterface;
};

// custom hook for register form for inputting a one time verification code after
// submitting initial account data
const useSignUpOTP = ({
  changeLoading,
  changeStep,
  changeSubmitError,
  registerData,
}: input) => {
  // initial numbers for each number box
  const initialState: OneTimeCodeFormData = {
    0: "0",
    1: "0",
    2: "0",
    3: "0",
    4: "0",
    5: "0",
  };

  // for whether the separate number boxes has been given an inputted number and be given a green background
  const initialSelect: OneTimeCodeSelect = {
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };

  const [formData, setFormData] = useState<OneTimeCodeFormData>(initialState);
  const [formSelect, setFormSelect] =
    useState<OneTimeCodeSelect>(initialSelect);
  //to let the user know which number box is currently selected
  const [currPlace, setCurrPlace] = useState<number>(0);

  // sets the current place number to whatever key the user pressed and increases the current place by one
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, num: digits): void => {
      e.preventDefault();
      if (currPlace <= 5) {
        setFormData((data) => ({ ...data, [currPlace]: num }));
        setFormSelect((data) => ({ ...data, [currPlace]: true }));
        setCurrPlace(currPlace + 1);
      }
    },
    [formData, formSelect]
  );
  // sets the current place number to 0 and decreases the current place by one
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (currPlace > 0) {
        let backOnePlace = currPlace - 1;
        setFormData((data) => ({ ...data, [backOnePlace]: "0" }));
        setFormSelect((data) => ({ ...data, [backOnePlace]: false }));
        setCurrPlace(backOnePlace);
      }
    },
    [formData, formSelect]
  );

  // submits user inputted one time code to db and checks if they match; if they do not match, they are
  // returned to this page, otherwise they move on to the next step
  const handleSubmit = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ): Promise<void> => {
      e.preventDefault();
      if (currPlace >= 6) {
        try {
          changeLoading(true);
          let code: string = joinOTPCode(formData);
          let data: OneTimeCodeData = {
            username: registerData.username,
            email: registerData.email,
            code,
          };
          await RegisterAPI.confirmOTP(data);
          changeStep(e, "showAdditionalForm");
          if (e) changeSubmitError("", e);
        } catch (err: any) {
          changeSubmitError(err.message, e);
        } finally {
          changeLoading(false);
        }
      } else {
        changeSubmitError("Please fill all 6 boxes of the code.", e);
      }
    },
    [formData, currPlace]
  );

  return {
    formData,
    formSelect,
    currPlace,
    handlePress,
    handleDelete,
    handleSubmit,
  };
};

export default useSignUpOTP;
