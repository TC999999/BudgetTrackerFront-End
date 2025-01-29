import { useState, useEffect } from "react";
import { logInUser, removeUserError } from "../features/auth/authSlice";
import { LogInInterface } from "../interfaces/authInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { Link } from "react-router-dom";

const LogIn = () => {
  const initialState = { username: "", password: "" };
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<LogInInterface>(initialState);

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  useEffect(() => {
    let inputs = localStorage.getItem("userInputs");
    if (inputs) {
      setFormData(JSON.parse(inputs));
      localStorage.removeItem("userInputs");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (userStatus.error) {
      dispatch(removeUserError());
    }
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      const logInInfo: LogInInterface = {
        username,
        password,
      };
      localStorage.setItem(
        "userInputs",
        JSON.stringify({ ...formData, password: "" })
      );
      await dispatch(logInUser(logInInfo));
      localStorage.removeItem("userInputs");
    } catch (err) {
      console.log("error in login");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1 className="text-3xl font-bold underline">Log in Here!</h1>
        <form onSubmit={handleSubmit}>
          <div className="username-div">
            <label htmlFor="username">Username: </label>
            <input
              id="login_username"
              type="text"
              name="username"
              placeholder="type your username here"
              value={formData.username}
              onChange={handleChange}
              // required
            />
          </div>
          <div className="password-div">
            <label htmlFor="password">Password: </label>
            <input
              id="login_password"
              type="password"
              name="password"
              placeholder="type your password here"
              value={formData.password}
              onChange={handleChange}
              // required
            />
          </div>
          <div className="button-div">
            <button className="get-profile-button">Log In!</button>
          </div>
          <div className="error-message">
            {userStatus.error && <p>{userStatus.error}</p>}
          </div>
        </form>
      </div>
      <p>
        Not a user yet? <Link to="/register">Make an account here!</Link>
      </p>
    </div>
  );
};

export default LogIn;
