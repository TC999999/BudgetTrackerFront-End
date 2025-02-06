import { useState, useEffect } from "react";
import { removeUserError } from "../features/auth/authSlice";
import { logInUser } from "../features/actions/auth";
import { LogInInterface } from "../interfaces/authInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { Link } from "react-router-dom";

const LogIn: React.FC = () => {
  const initialState: LogInInterface = { username: "", password: "" };
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<LogInInterface>(initialState);

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
    <div
      tabIndex={-1}
      className="login-page-div bg-gray-500 bg-opacity-50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
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
                className="text-gray-900 text-xl text-center mb-2 w-96 border-2 focus:border-green-600 focus:outline-none"
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
              <label className="text-lg block" htmlFor="password">
                Password:{" "}
              </label>
              <input
                className="text-gray-900 text-xl text-center mb-2 w-96 border-2 focus:border-green-600 focus:outline-none"
                id="login_password"
                type="password"
                name="password"
                placeholder="type your password here"
                value={formData.password}
                onChange={handleChange}
                // required
              />
            </div>
            <div className="button-div text-center m-2">
              <button className="get-profile-button border-2 border-green-500 rounded-full bg-green-400 p-2 hover:bg-green-900 hover:text-white">
                Log In!
              </button>
            </div>
            {userStatus.error && (
              <div className="error-message text-red-500">
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
      </div>
    </div>
  );
};

export default LogIn;
