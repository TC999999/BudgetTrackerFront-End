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

type Props = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
};

type FormInfo = {
  value: number;
};

const EditUserForm: React.FC<Props> = ({ hideForm }) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState: FormInfo = {
    value: 0,
  };
  const [formData, setFormData] = useState<FormInfo>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const currentAssets = useRef<number>(
    (userStatus.user!.totalAssets || 1) * 100
  );
  const newAssets = useRef<number>(userStatus.user!.totalAssets * 100);
  const maxNum = useRef<number>(99999999999999);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.value, num);
      if (newNum > maxNum.current) {
        setKeyPadError(true);
      } else {
        setFormData((data) => ({
          ...data,
          value: newNum,
        }));
        newAssets.current = currentAssets.current + newNum;
      }
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { value } = formData;
      const submitData: UserEditInterface = {
        value: value / 100,
      };
      await dispatch(addToAssets(submitData)).unwrap();
      hideForm(e);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  return isLoading ? (
    <SmallLoadingMsg />
  ) : (
    <div tabIndex={-1} className="add-to-assets-form-div modal-layer-1">
      <div className="modal-layer-2">
        <div className="add-to-assets-form modal-layer-3">
          <h1 className="text-xl text-center">Add to Your Current Assets</h1>
          <h2 className="text-lg text-center">
            New Assets: <span>${(newAssets.current / 100).toFixed(2)}</span>
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="added-assets-div text-center">
              <label className="text-gray-700 block" htmlFor="addedAssets">
                Amount to Add to Assets ($ U.S.):{" "}
              </label>
              <input
                className="text-gray-900 text-xl text-center mb-2"
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
            <div className="keyPad-div px-2 py-2">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.value}
              />
            </div>
            {keyPadError && (
              <div className="text-red-700 font-bold">
                <p>You've reached the maximum asset value.</p>
              </div>
            )}
            <div className="button-div flex justify-between">
              <button className="add-asset-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                Add to your Assets
              </button>
              <button
                className="bg-gray-600 text-gray-100 border-2 border-gray-900 rounded-full px-2 py-2 hover:bg-gray-200 hover:text-gray-600"
                onClick={(e) => hideForm(e)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
