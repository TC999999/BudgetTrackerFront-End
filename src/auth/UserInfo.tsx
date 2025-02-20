import { useState } from "react";
import { PasswordResetInfo, CurrentStep } from "../interfaces/authInterfaces";
import ResetPasswordAPI from "../helpers/ResetPasswordAPI";
import SmallLoadingMsg from "../SmallLoadingMsg";

type Props = {
  changeStep: (e: React.FormEvent, newStep: CurrentStep) => void;
  changeSubmitError: (e: React.FormEvent, newStep: string) => void;
  changeUser: (e: React.FormEvent, newUser: PasswordResetInfo) => void;
};

const UserInfo: React.FC<Props> = ({
  changeStep,
  changeSubmitError,
  changeUser,
}) => {
  const initialState: PasswordResetInfo = {
    username: "",
    email: "",
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<PasswordResetInfo>(initialState);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    let { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let res: PasswordResetInfo = await ResetPasswordAPI.confirmUserInfo(
        formData
      );
      //   console.log("NO ERRORS HERE");
      //   console.log(res);
      changeStep(e, "oneTimeCode");
      changeSubmitError(e, "");
      changeUser(e, res);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      changeSubmitError(e, err.message);
      //   console.log("OH NO!!!");
      //   console.log(err.message);
    }
  };

  return (
    <div className="user-info-form-page">
      {isLoading && <SmallLoadingMsg />}
      <div className="user-info-form-div">
        <h1>
          Please input your username and the email linked to your account below.
        </h1>
        <div className="user-info-form">
          <form onSubmit={handleSubmit}>
            <div className="username-div">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                placeholder="type your username here"
                onChange={handleChange}
              />
            </div>
            <div className="email-div">
              <label htmlFor="">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="type email connected to username here"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <button>Get One Time Code</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
