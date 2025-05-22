import { ConfirmUserInfo, CurrentStep } from "../interfaces/authInterfaces";
import useUserInfo from "./hooks/useUserInfo";
import AuthTabs from "../motionWrappers/AuthTabs";

type Props = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (newSubmitError: string, e: React.FormEvent) => void;
  changeUser: (e: React.FormEvent, newUser: ConfirmUserInfo) => void;
  show: boolean;
};

// For to input user email and username to make a request for a one time verification
// code if the user has forgotten their password.
const UserInfo: React.FC<Props> = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  changeUser,
  show,
}): JSX.Element => {
  const { formData, formErrors, flashErrors, handleChange, handleSubmit } =
    useUserInfo({ changeStep, changeLoading, changeSubmitError, changeUser });

  return (
    <AuthTabs show={show}>
      <div id="user-info-form-div">
        <h1 className="text-center text-xl sm:text-3xl p-2 text-green-500 font-bold underline">
          Confirm Your Information Here
        </h1>
        <h1 className="font-bold text-center p-2">
          Please input your username and the email address linked to your
          account below. Afterwards, you will be sent a 6-digit verification
          code to the email address you provided.
        </h1>
        <div id="user-info-form">
          <form onSubmit={handleSubmit}>
            <div id="username-div">
              <label className="text-lg block" htmlFor="username">
                Username:
              </label>
              <input
                type="text"
                className={`userInfo-input ${
                  formErrors.username ? "input-error" : "input-valid"
                } ${flashErrors.username && "animate-blink-error"}`}
                id="username"
                name="username"
                value={formData.username}
                placeholder="type your username here"
                onChange={handleChange}
              />
              {formErrors.username && (
                <div id="username-error" className="text-red-600 font-bold">
                  <p>{formErrors.username}</p>
                </div>
              )}
            </div>
            <div id="email-div">
              <label className="text-lg block" htmlFor="email">
                Email:
              </label>
              <input
                type="text"
                className={`userInfo-input ${
                  formErrors.email ? "input-error" : "input-valid"
                } ${flashErrors.email && "animate-blink-error"}`}
                id="email"
                name="email"
                placeholder="type email connected to username here"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <div id="email-error" className="text-red-600 font-bold">
                  <p>{formErrors.email}</p>
                </div>
              )}
            </div>

            <div id="submit-code-button-div" className="text-center">
              <button
                id="submit-code-div"
                className="border-2 text-gray-100 border-green-900 bg-green-500 p-2 rounded-full hover:bg-green-200 hover:text-black duration-150"
              >
                Get One Time Verification Code
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthTabs>
  );
};

export default UserInfo;
