import { useState, useCallback, useRef, useMemo } from "react";
import {
  UserContextInterface,
  UserEditInterface,
  UserEditErrors,
} from "../interfaces/userInterfaces";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { calculateNewTotalAssetsUserDashboard } from "../helpers/calculateNewTotalAssets";
import {
  handleUserComparisons,
  handleUserEditInputErrors,
  handleEditUserSubmitErrors,
} from "../helpers/handleUserEditErrors";
import { createUpdateUserString } from "../helpers/createNotificationString";
import { addToAssets } from "../features/actions/users";
import { toast } from "react-toastify";

type Props = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
};

type FormInfo = {
  value: number;
  operation: string;
};

const EditUserForm: React.FC<Props> = ({ hideForm }): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const notify = (notificaation: string) => toast.success(notificaation);
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState: FormInfo = {
    value: 0,
    operation: "add",
  };
  const initalErrors: UserEditErrors = { value: "" };
  const [formData, setFormData] = useState<FormInfo>(initialState);
  const maxNum = useRef<number>(99999999999999);
  const [formErrors, setFormErrors] = useState<UserEditErrors>(initalErrors);
  const [flashInput, setFlashInput] = useState<boolean>(false);
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
      let errors = handleUserComparisons(
        newNum,
        setFormErrors,
        formData.operation,
        maxNum.current,
        userStatus.user!.totalAssets * 100
      );
      if (!errors) {
        setFormData((data) => ({
          ...data,
          value: newNum,
        }));
      } else {
        setTimeout(() => {
          setFormErrors((data) => ({ ...data, value: "" }));
        }, 1500);
      }
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.value);
      handleUserEditInputErrors("value", newNum, setFormErrors);
      setFormData((data) => ({
        ...data,
        value: newNum,
      }));
    },
    [formData]
  );

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (
      !handleUserComparisons(
        formData.value,
        setFormErrors,
        value,
        maxNum.current,
        userStatus.user!.totalAssets * 100
      )
    ) {
      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
    } else {
      setTimeout(() => {
        setFormErrors((data) => ({ ...data, value: "" }));
      }, 1500);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (handleEditUserSubmitErrors(formData, setFormErrors)) {
        const { value, operation } = formData;
        const submitData: UserEditInterface = {
          value: operation === "add" ? +value / 100 : -value / 100,
        };
        await dispatch(addToAssets(submitData)).unwrap();
        hideForm(e);
        notify(createUpdateUserString(submitData));
      } else {
        setFlashInput(true);
        setTimeout(() => {
          setFlashInput(false);
        }, 500);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return !userStatus.smallLoading ? (
    <div tabIndex={-1} className="add-to-assets-form-div modal-layer-1">
      <div className="modal-layer-2">
        <div className="add-to-assets-form text-center modal-layer-3">
          <header>
            <h1 className="text-3xl text-green-800 font-bold underline">
              Update Your Current Assets
            </h1>
            <h2 className="text-lg">Your New Assets Will Be:</h2>
            <h2 className="text-4xl text-green-700 font-bold">
              ${newTotalAssets}
            </h2>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="added-assets-div">
              <label className="text-gray-700 block" htmlFor="addedAssets">
                How much are you adding or subtracting from your current total
                assets? ($ U.S.):{" "}
              </label>
              <input
                className={`input ${formErrors.value ? "input-error" : ""} ${
                  flashInput ? "animate-blinkError" : ""
                }`}
                id="added_assets"
                type="text"
                name="addedAssets"
                placeholder="0.00"
                value={`$${(formData.value / 100).toFixed(2)}`}
                required
                readOnly
              />
              {formErrors.value && (
                <div className="error-message">
                  <p className="text-lg text-red-700 font-bold">
                    {formErrors.value}
                  </p>
                </div>
              )}
            </div>
            <div className="edit-user-radio-buttons">
              <fieldset className="edit-user-choices">
                <legend className="font-bold">
                  Are you adding or subtracting this amount from your available
                  assets?
                </legend>
                <div className="border border-green-600 shadow-md rounded-full">
                  <div
                    className={`p-2 border-b border-green-600 rounded-t-full ${
                      formData.operation === "add" ? "bg-green-100" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="add"
                      name="operation"
                      value="add"
                      onChange={handleRadio}
                      className="radio radio-add form-radio"
                      checked={formData.operation === "add"}
                    />
                    <label htmlFor="add">Add to Funds</label>
                  </div>
                  <div
                    className={`p-2 rounded-b-full ${
                      formData.operation === "subtract" ? "bg-red-100" : ""
                    } `}
                  >
                    <input
                      type="radio"
                      id="remove"
                      name="operation"
                      value="subtract"
                      onChange={handleRadio}
                      className="radio radio-subtract form-radio"
                      checked={formData.operation === "subtract"}
                    />
                    <label htmlFor="remove">Subtract from Funds</label>
                  </div>
                </div>
              </fieldset>
            </div>
            <div className="keyPad-div px-2 py-2">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.value}
              />
            </div>
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
  ) : null;
};

export default EditUserForm;
