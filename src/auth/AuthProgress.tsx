import { StepCompleted, CurrentStep } from "../interfaces/authInterfaces";
import { stepList, step } from "../interfaces/registerInterfaces";
import AuthProgressHeader from "./AuthProgressHeader";

type Props = {
  type: "register" | "resetPassword";
  stepList: StepCompleted | stepList;
  currentStep: CurrentStep | step;
  currentProgress: number;
};

// progress bar for multipart forms: when user completes one part of the form,
// they move on to the next
const AuthProgress: React.FC<Props> = ({
  type,
  stepList,
  currentStep,
  currentProgress,
}) => {
  return (
    <div
      id="multipart-form-progress-div"
      className="border-4 my-2 border-green-700 rounded-lg relative"
    >
      <div
        id="progress-headers"
        className={`grid grid-cols-${type === "register" ? 3 : 4}`}
      >
        {"showSensitiveForm" in stepList && (
          <AuthProgressHeader
            place="beginning"
            current={currentStep === "showSensitiveForm"}
            done={stepList.showSensitiveForm}
            label="Account Information"
          />
        )}
        {"showOTPForm" in stepList && (
          <AuthProgressHeader
            place="middle"
            current={currentStep === "showOTPForm"}
            done={stepList.showOTPForm}
            label="Enter Code"
          />
        )}
        {"showAdditionalForm" in stepList && (
          <AuthProgressHeader
            place="end"
            current={currentStep === "showAdditionalForm"}
            done={stepList.showAdditionalForm}
            label="Extra Information"
          />
        )}

        {"userInfo" in stepList && (
          <AuthProgressHeader
            place="beginning"
            current={currentStep === "userInfo"}
            done={stepList.userInfo}
            label="Confirm Info"
          />
        )}
        {"oneTimeCode" in stepList && (
          <AuthProgressHeader
            place="middle"
            current={currentStep === "oneTimeCode"}
            done={stepList.oneTimeCode}
            label="Enter Code"
          />
        )}
        {"newPassword" in stepList && (
          <AuthProgressHeader
            place="middle"
            current={currentStep === "newPassword"}
            done={stepList.newPassword}
            label="Reset Password"
          />
        )}
        {"success" in stepList && (
          <AuthProgressHeader
            place="end"
            current={currentStep === "success"}
            done={stepList.success}
            label="Success"
          />
        )}
      </div>
      <div
        id="multipart-form-progress-bar "
        className="absolute bottom-0 w-full"
      >
        <progress
          className="w-full  [&::-webkit-progress-value]:bg-green-700"
          max={99}
          value={currentProgress}
        ></progress>
      </div>
    </div>
  );
};

export default AuthProgress;
