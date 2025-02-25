import { useState } from "react";
import {
  ConfirmUserInfo,
  CurrentStep,
  UserInfoErrors,
  UserInfoFlashErrors,
} from "../interfaces/authInterfaces";
import ResetPasswordAPI from "../helpers/ResetPasswordAPI";
import {
  handleUserInfoInputErrors,
  handleUserInfoSubmitErrors,
} from "../helpers/handleUserInfoErrors";

type Props = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeLoading: (loadingStatus: boolean) => void;
  changeSubmitError: (e: React.FormEvent, newSubmitError: string) => void;
  changeUser: (e: React.FormEvent, newUser: ConfirmUserInfo) => void;
};

const UserInfo: React.FC<Props> = ({
  changeStep,
  changeLoading,
  changeSubmitError,
  changeUser,
}): JSX.Element => {
  const initialState: ConfirmUserInfo = {
    username: "",
    email: "",
  };
  const initialErrors: UserInfoErrors = {
    username: "",
    email: "",
  };
  const [formData, setFormData] = useState<ConfirmUserInfo>(initialState);
  const [formErrors, setFormErrors] = useState<UserInfoErrors>(initialErrors);
  const [flashErrors, setFlashErrors] = useState<UserInfoFlashErrors>({
    username: false,
    email: false,
  });

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    let { name, value } = e.target;
    if (name === "username" || name === "email") {
      handleUserInfoInputErrors(name, value, setFormErrors);
      setFormData((data) => ({ ...data, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      if (handleUserInfoSubmitErrors(formData, setFormErrors)) {
        changeLoading(true);
        let res: ConfirmUserInfo = await ResetPasswordAPI.confirmUserInfo(
          formData
        );
        changeStep(e, "oneTimeCode");
        changeSubmitError(e, "");
        changeUser(e, res);
        changeLoading(false);
      } else {
        if (formErrors.username || formData.username === "")
          setFlashErrors((flash) => ({ ...flash, username: true }));
        if (formErrors.email || formData.email === "")
          setFlashErrors((flash) => ({ ...flash, email: true }));
        setTimeout(() => {
          setFlashErrors({ username: false, email: false });
        }, 500);
      }
    } catch (err: any) {
      changeLoading(false);
      changeSubmitError(e, err.message);
    }
  };

  return (
    <div className="user-info-form-page">
      <div className="user-info-form-div">
        <h1 className="text-center text-xl p-2">
          Confirm Your Information Here
        </h1>
        <h1 className="font-bold text-center p-2">
          Please input your username and the email linked to your account below.
          Afterwards, you will be sent a 6-digit verification code to the email
          address you provided.
        </h1>
        <div className="user-info-form">
          <form onSubmit={handleSubmit}>
            <div className="username-div">
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
                <div className="username-error text-red-600 font-bold">
                  <p>{formErrors.username}</p>
                </div>
              )}
            </div>
            <div className="email-div">
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
                <div className="email-error text-red-600 font-bold">
                  <p>{formErrors.email}</p>
                </div>
              )}
            </div>

            <div className="submit-code-button text-center">
              <button className="submit-code border-2 text-gray-100 border-green-900 bg-green-500 p-2 rounded-full hover:bg-green-200 hover:text-black duration-150">
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
