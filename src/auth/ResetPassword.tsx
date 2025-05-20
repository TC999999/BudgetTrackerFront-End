import { useNavigate, NavigateFunction } from "react-router-dom";
import UserInfo from "./UserInfo";
import OneTimeCode from "./OneTimeCode";
import NewPassword from "./NewPassword";
import ErrorWindow from "./ErrorWindow";
import PasswordResetSuccess from "./PasswordResetSuccess";
import { CiCircleCheck } from "react-icons/ci";
import useResetPassword from "./hooks/useResetPassword";
import { AnimatePresence } from "motion/react";

// main page for users attempting to reset password
const ResetPassword = (): JSX.Element => {
  const navigate: NavigateFunction = useNavigate();
  const {
    currentStep,
    submitError,
    currentUser,
    stepList,
    currentProgress,
    changeLoading,
    changeStep,
    changeSubmitError,
    changeUser,
  } = useResetPassword();

  return (
    <div id="reset-password-page-div">
      <button
        className="border border-gray-200 p-2 rounded-full bg-gray-400 shadow hover:bg-gray-200 transition-150 active:bg-gray-300"
        onClick={() => navigate("/")}
      >
        Go Back
      </button>

      <div
        id="reset-password-page-forms"
        className="bg-white p-2 m-2 border-4 border-green-600 rounded-lg"
      >
        <h1 className="text-5xl text-center text-green-800 underline">
          Reset Your Password
        </h1>
        <div
          id="reset-password-set-progress-div"
          className="border-4 my-2 border-green-700 rounded-lg relative"
        >
          <div id="progress-headers" className="grid grid-cols-4">
            <div
              id="confirm-info-header"
              className={`pt-4 pb-8 text-xs sm:text-base  flex justify-center items-center rounded-l-sm border-r-2 ${
                currentStep === "userInfo"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.userInfo ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Confirm Info</p>
              <CiCircleCheck className="text-xl" />
            </div>
            <div
              id="verification-code-header"
              className={`pt-4 pb-8 text-xs sm:text-base flex justify-center items-center border-r-2 ${
                currentStep === "oneTimeCode"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.oneTimeCode ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Enter Code</p>
              <CiCircleCheck className="text-xl" />
            </div>
            <div
              id="password-reset-header"
              className={`pt-4 pb-8 text-xs sm:text-base  flex justify-center items-center border-r-2${
                currentStep === "newPassword"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.newPassword ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Reset Password</p>
              <CiCircleCheck className="text-xl" />
            </div>
            <div
              id="success-header"
              className={`pt-4 pb-8 text-xs sm:text-base  flex justify-center items-center rounded-r-sm ${
                currentStep === "success"
                  ? "underline text-green-500 bg-green-100"
                  : ""
              } ${stepList.success ? "text-green-700 bg-green-500" : ""}`}
            >
              <p>Success</p>
              <CiCircleCheck className="text-xl" />
            </div>
          </div>

          <div
            id="reset-password-set-progress-bar "
            className="absolute bottom-0 w-full"
          >
            <progress
              className="w-full  [&::-webkit-progress-value]:bg-green-700"
              max={100}
              value={currentProgress}
            ></progress>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <div key={currentStep}>
            <UserInfo
              key="userInfo"
              changeStep={changeStep}
              changeLoading={changeLoading}
              changeSubmitError={changeSubmitError}
              changeUser={changeUser}
              show={currentStep === "userInfo"}
            />
            <OneTimeCode
              key="oneTimeCode"
              changeStep={changeStep}
              changeLoading={changeLoading}
              changeSubmitError={changeSubmitError}
              currentUser={currentUser}
              show={currentStep === "oneTimeCode"}
            />
            <NewPassword
              key="newPassword"
              changeStep={changeStep}
              changeLoading={changeLoading}
              changeSubmitError={changeSubmitError}
              currentUser={currentUser}
              show={currentStep === "newPassword"}
            />
            <PasswordResetSuccess
              key="success"
              show={currentStep === "success"}
            />
          </div>
        </AnimatePresence>

        <ErrorWindow
          changeSubmitError={changeSubmitError}
          submitError={submitError}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
