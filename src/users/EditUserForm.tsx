import { useState, useCallback } from "react";
import {
  UserContextInterface,
  UserEditInterface,
} from "../interfaces/userInterfaces";
import KeyPad from "../budgets/KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { addToAssets } from "../features/auth/authSlice";

interface Props {
  hideForm: any;
}

interface FormInfo {
  username: string;
  addedAssets: number;
  newAssets: number;
  currentAssets: number;
}

const EditUserForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState = {
    username: userStatus.user.username || "",
    addedAssets: 0,
    newAssets: (userStatus.user.totalAssets || 1) * 100,
    currentAssets: (userStatus.user.totalAssets || 1) * 100,
  };
  const [formData, setFormData] = useState<FormInfo>(initialState);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.addedAssets, num);
      setFormData((data) => ({
        ...data,
        addedAssets: newNum,
        newAssets: formData.currentAssets + newNum,
      }));
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      let newNum = numPop(formData.addedAssets);
      setFormData((data) => ({
        ...data,
        addedAssets: newNum,
        newAssets: formData.currentAssets + newNum,
      }));
      if (keyPadError) {
        setKeyPadError(false);
      }
    },
    [formData, keyPadError]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { username, newAssets } = formData;
      const submitData: UserEditInterface = {
        username,
        newAssets: newAssets / 100,
      };
      await dispatch(addToAssets(submitData)).unwrap();
      props.hideForm();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Add to Your Current Assets</h1>
      <h2>
        New Assets: <p>${(formData.newAssets / 100).toFixed(2)}</p>
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="added-assets-div">
          <label htmlFor="addedAssets">
            Amount to Add to Assets ($ U.S.):{" "}
          </label>
          <input
            id="added_assets"
            type="text"
            name="addedAssets"
            placeholder="0.00"
            value={`$${(formData.addedAssets / 100).toFixed(2)}`}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="keyPad-div">
          <KeyPad
            handlePress={handlePress}
            handleDelete={handleDelete}
            num={formData.addedAssets}
          />
        </div>
        {keyPadError && (
          <div className="error-message">
            {keyPadError && <p>budget funds cannot exceed total asset value</p>}
          </div>
        )}
        <div className="button-div">
          <button className="add-budget-button">Add to your Assets</button>
        </div>
      </form>

      <button onClick={props.hideForm}>Cancel</button>
    </div>
  );
};

export default EditUserForm;
