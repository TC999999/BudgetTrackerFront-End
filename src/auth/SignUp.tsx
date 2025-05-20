import SignUpSensitive from "./SignUpSensitive";
import SignUpOTP from "./SignUpOTP";
import SignUpAdditional from "./SignUpAdditional";
import ErrorWindow from "./ErrorWindow";
import useSignUp from "./hooks/useSignUp";
import { CiCircleCheck } from "react-icons/ci";
import { Link } from "react-router-dom";
import { AnimatePresence } from "motion/react";

// returns window allowing users to create a new account
const SignUp = (): JSX.Element => {
  const {
    registerData,
    stepList,
    currentStep,
    submitError,
    currentProgress,
    handleDataChange,
    changeLoading,
    changeStep,
    changeSubmitError,
  } = useSignUp();

  return (
    <main id="register-page">
      <div className="bg-white m-4 p-4 border-2 border-green-600 rounded-lg">
        <header>
          <h1 className="text-green-700 text-center text-xl sm:text-4xl font-bold underline">
            Create your Account
          </h1>
          <div
            id="reset-password-set-progress-div"
            className="border-4 my-2 border-green-700 rounded-lg relative"
          >
            <div id="progress-headers" className="grid grid-cols-3">
              <div
                id="confirm-info-header"
                className={`pt-4 pb-8 text-xs sm:text-base flex justify-center items-center rounded-l-sm border-r-2 ${
                  currentStep === "showSensitiveForm"
                    ? "underline text-green-500 bg-green-100"
                    : ""
                } ${
                  stepList.showSensitiveForm
                    ? "text-green-700 bg-green-500"
                    : ""
                }`}
              >
                <p>Account Information</p>
                <CiCircleCheck className="text-xl" />
              </div>
              <div
                id="verification-code-header"
                className={`pt-4 pb-8 text-xs sm:text-base flex justify-center items-center border-r-2 ${
                  currentStep === "showOTPForm"
                    ? "underline text-green-500 bg-green-100"
                    : ""
                } ${stepList.showOTPForm ? "text-green-700 bg-green-500" : ""}`}
              >
                <p>Enter Code</p>
                <CiCircleCheck className="text-xl" />
              </div>
              <div
                id="additional-info-header"
                className={`pt-4 pb-8 text-xs sm:text-base flex justify-center items-center border-r-2${
                  currentStep === "showAdditionalForm"
                    ? "underline text-green-500 bg-green-100"
                    : ""
                } ${
                  stepList.showAdditionalForm
                    ? "text-green-700 bg-green-500"
                    : ""
                }`}
              >
                <p>Extra Information</p>
                <div className="text-xl flex items-center">
                  <div>
                    <CiCircleCheck />
                  </div>
                </div>
              </div>
            </div>
            <div
              id="reset-password-set-progress-bar "
              className="absolute bottom-0 w-full"
            >
              <progress
                className="w-full  [&::-webkit-progress-value]:bg-green-700"
                max={99}
                value={currentProgress}
              ></progress>
            </div>
          </div>
          <div>
            <Link
              to="/"
              className="text-green-600 hover:underline hover:text-green-400 active:text-green-200"
            >
              Back to Login
            </Link>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <div key={currentStep}>
            <SignUpSensitive
              key="showSensitiveForm"
              handleDataChange={handleDataChange}
              changeLoading={changeLoading}
              changeStep={changeStep}
              changeSubmitError={changeSubmitError}
              show={currentStep === "showSensitiveForm"}
            />
            <SignUpOTP
              key="showOTPForm"
              registerData={registerData}
              changeLoading={changeLoading}
              changeStep={changeStep}
              changeSubmitError={changeSubmitError}
              show={currentStep === "showOTPForm"}
            />
            <SignUpAdditional
              key="showAdditionalForm"
              changeLoading={changeLoading}
              changeSubmitError={changeSubmitError}
              initialState={registerData}
              show={currentStep === "showAdditionalForm"}
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

export default SignUp;
