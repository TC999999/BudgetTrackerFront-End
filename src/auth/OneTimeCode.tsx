import { PasswordResetInput } from "../interfaces/authInterfaces";
import FullKeyPad from "../FullKeyPad";
import useOneTimeCode from "./hooks/useOneTimeCode";
import AuthTabs from "../motionWrappers/AuthTabs";

// returns page for users to enter one time code when resetting password
const OneTimeCode: React.FC<PasswordResetInput> = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  currentUser,
  show,
  mockSubmit,
}): JSX.Element => {
  const {
    formData,
    formSelect,
    currPlace,
    handlePress,
    handleDelete,
    handleSubmit,
  } = useOneTimeCode({
    changeStep,
    changeLoading,
    changeSubmitError,
    currentUser,
    mockSubmit,
  });

  return (
    <AuthTabs show={show}>
      <div id="one-time-code">
        <h1 className="text-center text-xl p-2">
          One-Time-One-Use Verification Code
        </h1>
        <h1 className="font-bold text-center p-2">
          A 6-digit verification code was just sent to your linked email. This
          code will expire after 2 minutes. Please enter the code below.
        </h1>
        <div id="one-time-code-form">
          <div id="one-time-code-digits" className="flex justify-center">
            <div
              role="digit-box"
              className={`digitPlace ${
                currPlace === 0 && "digitPlace-select"
              } ${formSelect[0] && "digitPlace-full"}`}
              id="digitPlace0"
            >
              {formData[0]}
            </div>
            <div
              role="digit-box"
              className={`digitPlace ${
                currPlace === 1 && "digitPlace-select"
              } ${formSelect[1] && "digitPlace-full"}`}
              id="digitPlace1"
            >
              {formData[1]}
            </div>
            <div
              role="digit-box"
              className={`digitPlace ${
                currPlace === 2 && "digitPlace-select"
              } ${formSelect[2] && "digitPlace-full"}`}
              id="digitPlace2"
            >
              {formData[2]}
            </div>
            <div
              role="digit-box"
              className={`digitPlace ${
                currPlace === 3 && "digitPlace-select"
              } ${formSelect[3] && "digitPlace-full"}`}
              id="digitPlace3"
            >
              {formData[3]}
            </div>
            <div
              role="digit-box"
              className={`digitPlace ${
                currPlace === 4 && "digitPlace-select"
              } ${formSelect[4] && "digitPlace-full"}`}
              id="digitPlace4"
            >
              {formData[4]}
            </div>
            <div
              role="digit-box"
              className={`digitPlace ${
                currPlace === 5 && "digitPlace-select"
              } ${formSelect[5] && "digitPlace-full"}`}
              id="digitPlace5"
            >
              {formData[5]}
            </div>
          </div>
          <FullKeyPad handlePress={handlePress} handleDelete={handleDelete} />
          <div id="submit-code-button-div" className="text-center">
            <button
              onClick={handleSubmit}
              id="submit-code-button"
              className="border-2 text-gray-100 border-green-900 bg-green-500 p-2 rounded-full hover:bg-green-200 hover:text-black duration-150"
            >
              Submit Code
            </button>
          </div>
        </div>
      </div>
    </AuthTabs>
  );
};

export default OneTimeCode;
