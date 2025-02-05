import { useCallback, useEffect, useState } from "react";
import { removeUserError } from "../features/auth/authSlice";
import { registerUser } from "../features/actions/auth";
import { SignUpInterface } from "../interfaces/authInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import KeyPad from "../KeyPad";
import { useNavigate } from "react-router-dom";

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
    <div className="register-page">
      <div className="register-form">
        <h1 className="text-3xl font-bold underline">Sign Up Here!</h1>
        <form onSubmit={handleSubmit}>
          <div className="username-div">
            <label htmlFor="username">Username: </label>
            <input
              id="signup_username"
              type="text"
              name="username"
              placeholder="type your username here"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="password-div">
            <label htmlFor="password">Password: </label>
            <input
              id="signup_password"
              type="password"
              name="password"
              placeholder="type your password here"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="total-assets-div">
            <label htmlFor="moneyAllocated">Total Assets: ($ U.S.): </label>
            <input
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
          <div className="keyPad-div">
            <KeyPad
              handlePress={handlePress}
              handleDelete={handleDelete}
              num={formData.totalAssets}
            />
          </div>

          <div className="button-div">
            <button className="make-profile-button">Sign Up!</button>
          </div>
          <div className="error-message">
            {userStatus.error && <p>{userStatus.error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
