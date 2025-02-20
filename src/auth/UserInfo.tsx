import { useState } from "react";
import { PasswordResetInfo, CurrentStep } from "../interfaces/authInterfaces";
import ResetPasswordAPI from "../helpers/ResetPasswordAPI";

type Props = {
  changeStep: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newStep: CurrentStep
  ) => void;
};

const UserInfo: React.FC<Props> = ({ changeStep }) => {
  const initialState: PasswordResetInfo = {
    username: "",
    email: "",
  };

  const [formData, setFormData] = useState<PasswordResetInfo>(initialState);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    let { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      console.log(formData);
      let res = await ResetPasswordAPI.confirmUserInfo(formData);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="user-info-form-page">
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
