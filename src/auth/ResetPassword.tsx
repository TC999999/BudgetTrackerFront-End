import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { setSmallLoading } from "../features/auth/authSlice";
import { UserContextInterface } from "../interfaces/userInterfaces";
import UserInfo from "./UserInfo";
import OneTimeCode from "./OneTimeCode";
import NewPassword from "./NewPassword";
import ErrorWindow from "./ErrorWindow";
import PasswordResetSuccess from "./PasswordResetSuccess";
import {
  CurrentStep,
  ConfirmUserInfo,
  StepCompleted,
} from "../interfaces/authInterfaces";
import { setResetProgress } from "../helpers/setResetProgress";
import { CiCircleCheck } from "react-icons/ci";

const ResetPassword = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialUser: ConfirmUserInfo = {
    username: "",
    email: "",
  };
  const initiaStepList: StepCompleted = {
    userInfo: false,
    oneTimeCode: false,
    newPassword: false,
    success: false,
  };

  const [currentStep, setCurrentStep] = useState<CurrentStep>("userInfo");
  const [submitError, setSubmitError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<ConfirmUserInfo>(initialUser);
  const [stepList, setStepList] = useState<StepCompleted>(initiaStepList);

  const currentProgress: number = useMemo<number>(
    () => setResetProgress(currentStep),
    [currentStep]
  );

  const changeLoading = useCallback(
    (loadingStatus: boolean): void => {
      dispatch(setSmallLoading(loadingStatus));
    },
    [userStatus.smallLoading]
  );

  const changeStep = useCallback(
    (e: React.FormEvent, newStep: CurrentStep): void => {
      e.preventDefault();
      setStepList((steps) => ({ ...steps, [currentStep]: true }));
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
          Reset Your Password
        </h1>
        <div className="reset-password-set-progress-div border-4 my-2 border-green-700 rounded-lg relative">
          <div className="progress-headers grid grid-cols-4">
            <div
              className={`confirm-info-header pt-4 pb-8 flex justify-center items-center rounded-l-sm border-r-2 ${
                currentStep === "userInfo"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.userInfo ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Confirm Info</p>
              <CiCircleCheck className="text-xl" />
            </div>
            <div
              className={`verification-code-header pt-4 pb-8 flex justify-center items-center border-r-2 ${
                currentStep === "oneTimeCode"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.oneTimeCode ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Verification Code</p>
              <CiCircleCheck className="text-xl" />
            </div>
            <div
              className={`reset-header-header pt-4 pb-8 flex justify-center items-center border-r-2${
                currentStep === "newPassword"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.newPassword ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Reset Password</p>
              <CiCircleCheck className="text-xl" />
            </div>
            <div
              className={`success-header pt-4 pb-8 flex justify-center items-center rounded-r-sm ${
                currentStep === "success"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.success ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Success</p>
              <CiCircleCheck className="text-xl" />
            </div>
          </div>

          <div className="reset-password-set-progress-bar absolute bottom-0 w-full">
            <progress
              className="w-full  [&::-webkit-progress-value]:bg-green-700"
              max={100}
              value={currentProgress}
            ></progress>
          </div>
        </div>

        {currentStep === "userInfo" && (
          <UserInfo
            changeStep={changeStep}
            changeLoading={changeLoading}
            changeSubmitError={changeSubmitError}
            changeUser={changeUser}
          />
        )}
        {currentStep === "oneTimeCode" && (
          <OneTimeCode
            changeStep={changeStep}
            changeLoading={changeLoading}
            changeSubmitError={changeSubmitError}
            currentUser={currentUser}
          />
        )}
        {currentStep === "newPassword" && (
          <NewPassword
            changeStep={changeStep}
            changeLoading={changeLoading}
            changeSubmitError={changeSubmitError}
            currentUser={currentUser}
          />
        )}
        {currentStep === "success" && <PasswordResetSuccess />}
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
