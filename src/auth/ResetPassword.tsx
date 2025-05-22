import { useNavigate, NavigateFunction } from "react-router-dom";
import UserInfo from "./UserInfo";
import OneTimeCode from "./OneTimeCode";
import NewPassword from "./NewPassword";
import ErrorWindow from "./ErrorWindow";
import PasswordResetSuccess from "./PasswordResetSuccess";
import useResetPassword from "./hooks/useResetPassword";
import { AnimatePresence } from "motion/react";
import AuthProgress from "./AuthProgress";

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
    <main id="reset-password-page">
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
        <AuthProgress
          type="resetPassword"
          stepList={stepList}
          currentStep={currentStep}
          currentProgress={currentProgress}
        />
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
    </main>
  );
};

export default ResetPassword;
