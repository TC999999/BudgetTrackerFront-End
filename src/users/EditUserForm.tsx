import { useState, useCallback, useRef, useMemo } from "react";
import {
  UserContextInterface,
  UserEditInterface,
} from "../interfaces/userInterfaces";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { calculateNewTotalAssetsUserDashboard } from "../helpers/calculateNewTotalAssets";
import { addToAssets } from "../features/actions/users";
import SmallLoadingMsg from "../SmallLoadingMsg";

type Props = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
};

type FormInfo = {
  value: number;
  operation: string;
};

const EditUserForm: React.FC<Props> = ({ hideForm }) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState: FormInfo = {
    value: 0,
    operation: "add",
  };
  const [formData, setFormData] = useState<FormInfo>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [radioErrorMessage, setRadioErrorMessage] = useState<string>("");
  const maxNum = useRef<number>(99999999999999);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);

  const newTotalAssets: string = useMemo<string>(() => {
    return calculateNewTotalAssetsUserDashboard(
      userStatus.user!.totalAssets,
      formData.value,
      formData.operation
    );
  }, [formData.value, formData.operation]);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.value, num);
      if (newNum > maxNum.current) {
        setKeyPadError(true);
      } else if (
        formData.operation === "subtract" &&
        newNum > userStatus.user!.totalAssets * 100
      ) {
        setRadioErrorMessage(
          "Cannot subtract a value greater than current total assets"
        );
      } else {
        setFormData((data) => ({
          ...data,
          value: newNum,
        }));
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
      if (keyPadError) {
        setKeyPadError(false);
      }
      if (radioErrorMessage) {
        setRadioErrorMessage("");
      }
    },
    [formData, keyPadError, radioErrorMessage]
  );

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (
      value === "subtract" &&
      formData.value > userStatus.user!.totalAssets * 100
    ) {
      setRadioErrorMessage(
        "Cannot subtract a value greater than current total assets"
      );
    } else {
      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
      if (radioErrorMessage) {
        setRadioErrorMessage("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { value, operation } = formData;
      const submitData: UserEditInterface = {
        value: operation === "add" ? +value / 100 : -value / 100,
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
          <h1 className="text-xl text-center">Update Your Current Assets</h1>
          <div className="new-assets-value text-center">
            <h2 className="text-lg text-center">New Assets:</h2>
            <h2 className="text-3xl text-green-700">${newTotalAssets}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="added-assets-div text-center">
              <label className="text-gray-700 block" htmlFor="addedAssets">
                How much are you adding or subtracting from your current total
                assets? ($ U.S.):{" "}
              </label>
              <input
                className="text-gray-900 text-xl text-center mb-2"
                id="added_assets"
                type="text"
                name="addedAssets"
                placeholder="0.00"
                value={`$${(formData.value / 100).toFixed(2)}`}
                required
                readOnly
              />
            </div>
            <div>
              <fieldset className="edit-budget-choices text-center">
                <legend className="font-bold">
                  Are you adding or subtracting this amount from your available
                  assets?
                </legend>
                <div className="border border-green-600 shadow-md rounded-full">
                  <div
                    className={`p-2 border-b border-green-600 rounded-t-full ${
                      formData.operation === "add"
                        ? "bg-green-100 font-bold"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="add"
                      name="operation"
                      value="add"
                      onChange={handleRadio}
                      className="radio"
                      checked={formData.operation === "add"}
                    />
                    <label htmlFor="add">Add to Funds</label>
                  </div>
                  <div
                    className={`p-2 rounded-b-full ${
                      formData.operation === "subtract"
                        ? "bg-green-100 font-bold"
                        : ""
                    } `}
                  >
                    <input
                      type="radio"
                      id="remove"
                      name="operation"
                      value="subtract"
                      onChange={handleRadio}
                      className="radio"
                      checked={formData.operation === "subtract"}
                    />
                    <label htmlFor="remove">Subtract from Funds</label>
                  </div>
                </div>
              </fieldset>
              {radioErrorMessage && (
                <div className="text-lg text-center text-red-700 font-bold">
                  <p>{radioErrorMessage}</p>
                </div>
              )}
            </div>
            <div className="keyPad-div px-2 py-2">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.value}
              />
            </div>
            {keyPadError && (
              <div className="text-red-700 font-bold text-center">
                <p>You've reached the maximum asset value.</p>
              </div>
            )}
            <div className="button-div flex justify-between">
              <button className="add-asset-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                Update your Assets
              </button>
              <button className="cancel-button" onClick={(e) => hideForm(e)}>
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
