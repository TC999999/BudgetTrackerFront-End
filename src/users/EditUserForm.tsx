import { useState, useCallback, useRef } from "react";
import {
  UserContextInterface,
  UserEditInterface,
} from "../interfaces/userInterfaces";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { addToAssets } from "../features/actions/users";
import SmallLoadingMsg from "../SmallLoadingMsg";

interface Props {
  hideForm: any;
}

interface FormInfo {
  value: number;
}

const EditUserForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState = {
    value: 0,
  };
  const [formData, setFormData] = useState<FormInfo>(initialState);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentAssets = useRef<number>(
    (userStatus.user.totalAssets || 1) * 100
  );
  const newAssets = useRef<number>((userStatus.user.totalAssets || 1) * 100);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.value, num);
      setFormData((data) => ({
        ...data,
        value: newNum,
      }));
      newAssets.current = currentAssets.current + newNum;
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      let newNum = numPop(formData.value);
      setFormData((data) => ({
        ...data,
        value: newNum,
      }));
      newAssets.current = currentAssets.current + newNum;
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
    setIsLoading(true);
    try {
      const { value } = formData;
      const submitData: UserEditInterface = {
        value: value / 100,
      };
      await dispatch(addToAssets(submitData)).unwrap();
      props.hideForm();
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="add-to-assets-form-div">
      {isLoading ? (
        <SmallLoadingMsg />
      ) : (
        <div className="add-to-assets-form">
          <h1>Add to Your Current Assets</h1>
          <h2>
            New Assets: <p>${(newAssets.current / 100).toFixed(2)}</p>
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
                value={`$${(formData.value / 100).toFixed(2)}`}
                onChange={handleChange}
                required
                readOnly
              />
            </div>
            <div className="keyPad-div">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.value}
              />
            </div>
            {keyPadError && (
              <div className="error-message">
                {keyPadError && (
                  <p>budget funds cannot exceed total asset value</p>
                )}
              </div>
            )}
            <div className="button-div">
              <button className="add-budget-button">Add to your Assets</button>
            </div>
          </form>

          <button onClick={props.hideForm}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default EditUserForm;
