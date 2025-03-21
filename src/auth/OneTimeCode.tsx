import { useState, useCallback } from "react";
import {
  OneTimeCodeFormData,
  OneTimeCodeSelect,
  OneTimeCodeData,
  CurrentStep,
  ConfirmUserInfo,
  digits,
} from "../interfaces/authInterfaces";
import ResetPasswordAPI from "../helpers/ResetPasswordAPI";
import { joinOTPCode } from "../helpers/joinOTPCode";
import FullKeyPad from "../FullKeyPad";

type Props = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (e: React.FormEvent, newStep: string) => void;
  currentUser: ConfirmUserInfo;
};

// returns page to enter one time
const OneTimeCode: React.FC<Props> = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  currentUser,
}): JSX.Element => {
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
    [formData]
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
    [formData]
  );

  // submits user inputted one time code to db and checks if they match; if they do not match, they are
  // returned to this page, otherwise they move on to the next step
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    try {
      changeLoading(true);
      let code: string = joinOTPCode(formData);
      let data: OneTimeCodeData = {
        username: currentUser.username,
        email: currentUser.email,
        code,
      };
      await ResetPasswordAPI.confirmOTP(data);
      changeStep(e, "newPassword");
      changeSubmitError(e, "");
      changeLoading(false);
    } catch (err: any) {
      changeLoading(false);
      changeSubmitError(e, err.message);
    }
  };
  return (
    <div className="one-time-code-div">
      <div className="one-time-code">
        <h1 className="text-center text-xl p-2">
          One-Time-One-Use Verification Code
        </h1>
        <h1 className="font-bold text-center p-2">
          A 6-digit verification code was just sent to your linked email. This
          code will expire after 2 minutes. Please enter the code below.
        </h1>
        <div className="one-time-code-form">
          <div className="one-time-code-digits flex justify-center">
            <div
              className={`digitPlace ${
                currPlace === 0 && "digitPlace-select"
              } ${formSelect[0] && "digitPlace-full"}`}
              id="digitPlace0"
            >
              {formData[0]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 1 && "digitPlace-select"
              } ${formSelect[1] && "digitPlace-full"}`}
              id="digitPlace1"
            >
              {formData[1]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 2 && "digitPlace-select"
              } ${formSelect[2] && "digitPlace-full"}`}
              id="digitPlace2"
            >
              {formData[2]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 3 && "digitPlace-select"
              } ${formSelect[3] && "digitPlace-full"}`}
              id="digitPlace3"
            >
              {formData[3]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 4 && "digitPlace-select"
              } ${formSelect[4] && "digitPlace-full"}`}
              id="digitPlace4"
            >
              {formData[4]}
            </div>
            <div
              className={`digitPlace ${
                currPlace === 5 && "digitPlace-select"
              } ${formSelect[5] && "digitPlace-full"}`}
              id="digitPlace5"
            >
              {formData[5]}
            </div>
          </div>
          <FullKeyPad handlePress={handlePress} handleDelete={handleDelete} />
          <div className="submit-code-button text-center">
            <button
              onClick={handleSubmit}
              className="submit-code border-2 text-gray-100 border-green-900 bg-green-500 p-2 rounded-full hover:bg-green-200 hover:text-black duration-150"
            >
              Submit Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneTimeCode;
