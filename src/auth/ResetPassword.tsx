import { useState, useCallback } from "react";
import UserInfo from "./UserInfo";
import OneTimeCode from "./OneTimeCode";
import NewPassword from "./NewPassword";
import { CurrentStep } from "../interfaces/authInterfaces";

const ResetPassword = () => {
  const [currentStep, setCurrentStep] = useState<CurrentStep>("userInfo");
  const [oneTimeCode, setOneTimeCode] = useState<string>("");

  const changeStep = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      newStep: CurrentStep
    ): void => {
      e.preventDefault();
      setCurrentStep(newStep);
    },
    [currentStep]
  );

  const changeOTC = useCallback(
    (newOneTimeCode: string) => {
      setOneTimeCode(newOneTimeCode);
    },
    [oneTimeCode]
  );

  return (
    <div className="reset-password-page-div">
      {currentStep === "userInfo" && <UserInfo changeStep={changeStep} />}
      {currentStep === "oneTimeCode" && <OneTimeCode />}
    </div>
  );
};

export default ResetPassword;
