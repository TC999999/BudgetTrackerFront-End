import { useCallback, useEffect, useState } from "react";
import { removeUserError } from "../features/auth/authSlice";
import { registerUser } from "../features/actions/auth";
import { SignUpInterface } from "../interfaces/authInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import KeyPad from "../KeyPad";
import { useNavigate } from "react-router-dom";
// import moneyPic from "../../public/signUp.jpg";

const SignUp = () => {
  const initialState: SignUpInterface = {
    username: "",
    password: "",
    totalAssets: 0,
  };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpInterface>(initialState);

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
    const { username, password, totalAssets } = formData;
    try {
      const signUpInfo: SignUpInterface = {
        username,
        password,
        totalAssets: totalAssets / 100,
      };
      localStorage.setItem(
        "userInputs",
        JSON.stringify({ ...formData, password: "" })
      );
      await dispatch(registerUser(signUpInfo)).unwrap();
      localStorage.removeItem("userInputs");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.totalAssets, num);
      setFormData((data) => ({ ...data, totalAssets: newNum }));
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.totalAssets);
      setFormData((data) => ({
        ...data,
        totalAssets: newNum,
      }));
    },
    [formData]
  );

  return (
    <div className="register-page bg-[url('../../public/signUp.jpg')] bg-cover bg-center bg-gray-500 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex flex-start w-full md:inset-0 max-h-full">
      <div className="register-form px-4 py-10 bg-white border-2 border-green-700 rounded-r-lg h-full">
        {/* <img src={moneyPic} alt="" /> */}
        <h1 className="text-3xl font-bold underline">Sign Up Here!</h1>
        <form onSubmit={handleSubmit}>
          <div className="username-div">
            <label className="text-lg block" htmlFor="username">
              Username:{" "}
            </label>
            <input
              className="text-gray-900 text-xl text-center mb-2 w-96 border-2 focus:border-green-600 focus:outline-none"
              id="signup_username"
              type="text"
              name="username"
              placeholder="type your username here"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="password-div">
            <label className="text-lg block" htmlFor="password">
              Password:{" "}
            </label>
            <input
              className="text-gray-900 text-xl text-center mb-2 w-96 border-2 focus:border-green-600 focus:outline-none"
              id="signup_password"
              type="password"
              name="password"
              placeholder="type your password here"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="total-assets-div">
            <label className="text-lg block" htmlFor="moneyAllocated">
              Total Assets: ($ U.S.):{" "}
            </label>
            <input
              className="text-gray-900 text-xl text-center mb-2 w-96 border-2 focus:border-green-600 focus:outline-none"
              id="total_assets"
              type="text"
              name="totalAssets"
              placeholder="0.00"
              value={`$${(formData.totalAssets / 100).toFixed(2)}`}
              onChange={handleChange}
              required
              readOnly
            />
          </div>
          <div className="keyPad-div flex flex-start m-5">
            <KeyPad
              handlePress={handlePress}
              handleDelete={handleDelete}
              num={formData.totalAssets}
            />
          </div>
          <div className="button-div">
            <button className="make-profile-button border-2 rounded-full border-green-500 bg-green-500 p-2">
              Sign Up!
            </button>
          </div>{" "}
          {userStatus.error && (
            <div className="error-message">
              <p className="text-red-400">{userStatus.error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
