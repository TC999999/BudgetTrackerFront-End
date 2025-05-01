import { ConfirmUserInfo, CurrentStep } from "../interfaces/authInterfaces";
import useUserInfo from "./hooks/useUserInfo";

type Props = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (e: React.FormEvent, newSubmitError: string) => void;
  changeUser: (e: React.FormEvent, newUser: ConfirmUserInfo) => void;
};

// For to input user email and username to make a request for a one time verification
// code if the user has forgotten their password.
const UserInfo: React.FC<Props> = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  changeUser,
}): JSX.Element => {
  const { formData, formErrors, flashErrors, handleChange, handleSubmit } =
    useUserInfo({ changeStep, changeLoading, changeSubmitError, changeUser });

  return (
    <div id="user-info-form-page">
      <div id="user-info-form-div">
        <h1 className="text-center text-xl p-2">
          Confirm Your Information Here
        </h1>
        <h1 className="font-bold text-center p-2">
          Please input your username and the email linked to your account below.
          Afterwards, you will be sent a 6-digit verification code to the email
          address you provided.
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
                } ${flashErrors.username && "animate-blinkError"}`}
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
                } ${flashErrors.email && "animate-blinkError"}`}
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
    </div>
  );
};

export default UserInfo;
