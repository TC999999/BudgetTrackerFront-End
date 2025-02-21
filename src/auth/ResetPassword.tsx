import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import OneTimeCode from "./OneTimeCode";
import NewPassword from "./NewPassword";
import ErrorWindow from "./ErrorWindow";
import { CurrentStep, ConfirmUserInfo } from "../interfaces/authInterfaces";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const initialUser: ConfirmUserInfo = {
    username: "",
    email: "",
  };
  const [currentStep, setCurrentStep] = useState<CurrentStep>("userInfo");
  const [submitError, setSubmitError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<ConfirmUserInfo>(initialUser);

  const changeStep = useCallback(
    (e: React.FormEvent, newStep: CurrentStep): void => {
      e.preventDefault();
      setCurrentStep(newStep);
    },
    [currentStep]
  );

  const changeSubmitError = useCallback(
    (
      e: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>,
      newSubmitError: string
    ): void => {
      e.preventDefault();
      setSubmitError(newSubmitError);
    },
    [submitError]
  );

  const changeUser = useCallback(
    (e: React.FormEvent, newUser: ConfirmUserInfo): void => {
      e.preventDefault();
      setCurrentUser(newUser);
    },
    [currentUser]
  );

  return (
    <div className="reset-password-page-div">
      <button
        className="border border-gray-200 p-2 rounded-full bg-gray-400 shadow hover:bg-gray-200 transition-150 active:bg-gray-300"
        onClick={() => navigate("/")}
      >
        Go Back
      </button>
      <div className="reset-password-page-forms bg-white p-2 m-2 border-4 border-green-600 rounded-lg">
        <h1 className="text-5xl text-center text-green-800 underline">
          Reset Password Here
        </h1>
        {currentStep === "userInfo" && (
          <UserInfo
            changeStep={changeStep}
            changeSubmitError={changeSubmitError}
            changeUser={changeUser}
          />
        )}
        {currentStep === "oneTimeCode" && (
          <OneTimeCode
            changeStep={changeStep}
            changeSubmitError={changeSubmitError}
            currentUser={currentUser}
          />
        )}
        {currentStep === "newPassword" && <NewPassword />}
        {/* <div className="submit-error-messages text-red-700 text-3xl font-bold text-center">
          {submitError}
        </div> */}
        {submitError && (
          <ErrorWindow
            changeSubmitError={changeSubmitError}
            submitError={submitError}
          />
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
