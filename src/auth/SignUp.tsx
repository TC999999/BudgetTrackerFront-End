import SignUpSensitive from "./SignUpSensitive";
import SignUpOTP from "./SignUpOTP";
import SignUpAdditional from "./SignUpAdditional";
import ErrorWindow from "./ErrorWindow";
import useSignUp from "./hooks/useSignUp";
import { Link } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import AuthProgress from "./AuthProgress";

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
          <AuthProgress
            type="register"
            stepList={stepList}
            currentStep={currentStep}
            currentProgress={currentProgress}
          />
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
