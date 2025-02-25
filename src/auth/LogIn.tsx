import { useState, useEffect } from "react";
import { removeUserError } from "../features/auth/authSlice";
import { logInUser } from "../features/actions/auth";
import {
  LogInInterface,
  LogInErrors,
  LogInFlashErrors,
} from "../interfaces/authInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import {
  handleLogInInputErrors,
  handleLogInSubmitErrors,
} from "../helpers/handleLogInErrors";
import { Link } from "react-router-dom";

const LogIn: React.FC = () => {
  const initialState: LogInInterface = { username: "", password: "" };
  const initialErrors: LogInErrors = {
    username: "",
    password: "",
  };
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<LogInInterface>(initialState);
  const [logInErrors, setLogInErrors] = useState<LogInErrors>(initialErrors);
  const [flashInput, setFlashInput] = useState<LogInFlashErrors>({
    username: false,
    password: false,
  });

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  useEffect(() => {
    let inputs: string | null = localStorage.getItem("userInputs");
    if (inputs) {
      setFormData(JSON.parse(inputs));
      localStorage.removeItem("userInputs");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (userStatus.error) {
      dispatch(removeUserError());
    }
    const { name, value } = e.target;
    if (name === "username" || name === "password")
      handleLogInInputErrors(name, value, setLogInErrors);
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      const logInInfo: LogInInterface = {
        username,
        password,
      };
      if (handleLogInSubmitErrors(logInInfo, setLogInErrors)) {
        localStorage.setItem(
          "userInputs",
          JSON.stringify({ ...formData, password: "" })
        );
        await dispatch(logInUser(logInInfo));
        localStorage.removeItem("userInputs");
      } else {
        if (logInErrors.username || formData.username === "")
          setFlashInput((flash) => ({ ...flash, username: true }));
        if (logInErrors.password || formData.password === "")
          setFlashInput((flash) => ({ ...flash, password: true }));
        setTimeout(() => {
          setFlashInput({ username: false, password: false });
        }, 500);
      }
    } catch (err) {
      console.log("error in login");
    }
  };

  return (
    <div
      tabIndex={-1}
      className="login-page-div bg-gray-500 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full max-h-full"
    >
      <div className="login-page relative w-full p-4 max-w-md max-h-full">
        <div className="login-form relative p-10 bg-gray-100 rounded-lg shadow-sm border-2 border-green-900 px-2 py-2 w-full">
          <h1 className="text-3xl font-bold underline">Log in Here!</h1>
          <form onSubmit={handleSubmit}>
            <div className="username-div">
              <label className="text-lg block" htmlFor="username">
                Username:{" "}
              </label>
              <input
                className={`input 
                ${logInErrors.username ? "input-error" : "input-valid"} ${
                  flashInput.username && "animate-blinkError"
                }`}
                id="login_username"
                type="text"
                name="username"
                placeholder="type your username here"
                value={formData.username}
                onChange={handleChange}
                maxLength={30}
              />
              {logInErrors.username && (
                <div className="username-error text-red-600 font-bold">
                  <p>{logInErrors.username}</p>
                </div>
              )}
            </div>
            <div className="password-div">
              <label className="text-lg block" htmlFor="password">
                Password:{" "}
              </label>
              <input
                className={`input 
                  ${logInErrors.password ? "input-error" : "input-valid"} ${
                  flashInput.password && "animate-blinkError"
                }`}
                id="login_password"
                type="password"
                name="password"
                placeholder="type your password here"
                value={formData.password}
                onChange={handleChange}
                maxLength={20}
              />
              {logInErrors.password && (
                <div className="password-error text-red-600 font-bold">
                  <p>{logInErrors.password}</p>
                </div>
              )}
            </div>
            <div className="button-div text-center m-2">
              <button className="get-profile-button border-2 border-green-500 rounded-full bg-green-400 p-2 hover:bg-green-900 hover:text-white">
                Log In!
              </button>
            </div>
            {typeof userStatus.error === "string" && (
              <div className="error-message text-center text-red-500 text-xl font-bold">
                <p>{userStatus.error}</p>
              </div>
            )}
          </form>
        </div>
        <p>
          Not a user yet?{" "}
          <Link
            className="text-blue-900 hover:text-blue-500 hover:underline active:text-blue-300"
            to="/register"
          >
            Make an account here!
          </Link>
        </p>

        <p>
          Forget your password?{" "}
          <Link
            className="text-blue-900 hover:text-blue-500 hover:underline active:text-blue-300"
            to="/resetPassword"
          >
            Reset it here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;
