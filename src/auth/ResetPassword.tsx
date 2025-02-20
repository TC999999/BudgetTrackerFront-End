import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserInfo from "./UserInfo";
import OneTimeCode from "./OneTimeCode";
import NewPassword from "./NewPassword";
import { CurrentStep, PasswordResetInfo } from "../interfaces/authInterfaces";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const initialUser: PasswordResetInfo = {
    username: "",
    email: "",
  };
  const [currentStep, setCurrentStep] = useState<CurrentStep>("userInfo");
  const [submitError, setSubmitError] = useState<string>("");
  const [currentUser, setCurrentUser] =
    useState<PasswordResetInfo>(initialUser);

  const changeStep = useCallback(
    (e: React.FormEvent, newStep: CurrentStep): void => {
      e.preventDefault();
      setCurrentStep(newStep);
    },
    [currentStep]
  );

  const changeSubmitError = useCallback(
    (e: React.FormEvent, newSubmitError: string): void => {
      e.preventDefault();
      setSubmitError(newSubmitError);
    },
    [submitError]
  );

  const changeUser = useCallback(
    (e: React.FormEvent, newUser: PasswordResetInfo): void => {
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

      <h1>Reset Password Here</h1>
      {currentStep === "userInfo" && (
        <UserInfo
          changeStep={changeStep}
          changeSubmitError={changeSubmitError}
          changeUser={changeUser}
        />
      )}
      {currentStep === "oneTimeCode" && <OneTimeCode />}
      {currentStep === "newPassword" && <NewPassword />}
      <div className="submit-error-messages text-red-700 font-bold">
        {submitError}
      </div>
    </div>
  );
};

export default ResetPassword;
