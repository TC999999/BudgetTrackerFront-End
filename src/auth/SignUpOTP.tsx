import { SignUpInterface } from "../interfaces/authInterfaces";
import { step } from "../interfaces/registerInterfaces";
import FullKeyPad from "../FullKeyPad";
import useSignUpOTP from "./hooks/useSignUpOTP";
import AuthTabs from "../motionWrappers/AuthTabs";

type Props = {
  registerData: SignUpInterface;
  changeLoading: (loadingStatus: boolean) => void;
  changeStep(e: React.FormEvent, newStep: step): void;
  changeSubmitError: (
    newSubmitError: string,
    e: React.FormEvent | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  show: boolean;
};

// window for register form for users to enter the one time verification code sent to their email
// address
const SignUpOTP: React.FC<Props> = ({
  registerData,
  changeLoading,
  changeStep,
  changeSubmitError,
  show,
}) => {
  const {
    formData,
    formSelect,
    currPlace,
    handlePress,
    handleDelete,
    handleSubmit,
  } = useSignUpOTP({
    registerData,
    changeLoading,
    changeStep,
    changeSubmitError,
  });
  return (
    <AuthTabs show={show}>
      <div
        id="one-time-code-div"
        className="p-2 bg-green-100 border-2 border-green-700 rounded-lg"
      >
        <div id="one-time-code">
          <h1 className="text-center text-xl p-2">
            One-Time-One-Use Verification Code
          </h1>
          <h1 className="font-bold text-center p-2">
            A 6-digit verification code was just sent to the provided email.
            This code will expire after 10 minutes. Please enter the code below.
          </h1>
          <div id="one-time-code-form">
            <div id="one-time-code-digits" className="flex justify-center">
              <div
                className={`digitPlace ${
                  currPlace === 0 && "digitPlace-select"
                } ${formSelect[0] && "digitPlace-full"}`}
                id="digitPlace0"
              >
                {formData[0]}
              </div>
              <div
                className={`digitPlace ${
                  currPlace === 1 && "digitPlace-select"
                } ${formSelect[1] && "digitPlace-full"}`}
                id="digitPlace1"
              >
                {formData[1]}
              </div>
              <div
                className={`digitPlace ${
                  currPlace === 2 && "digitPlace-select"
                } ${formSelect[2] && "digitPlace-full"}`}
                id="digitPlace2"
              >
                {formData[2]}
              </div>
              <div
                className={`digitPlace ${
                  currPlace === 3 && "digitPlace-select"
                } ${formSelect[3] && "digitPlace-full"}`}
                id="digitPlace3"
              >
                {formData[3]}
              </div>
              <div
                className={`digitPlace ${
                  currPlace === 4 && "digitPlace-select"
                } ${formSelect[4] && "digitPlace-full"}`}
                id="digitPlace4"
              >
                {formData[4]}
              </div>
              <div
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
      </div>
    </AuthTabs>
  );
};

export default SignUpOTP;
