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
import { DateTime } from "luxon";
import { toast } from "react-toastify";

type Props = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
};

type FormInfo = {
  title: string;
  value: number;
  operation: string;
  date: string;
};

type flashErrors = { title: boolean; value: boolean; date: boolean };

// returns form modal for users to add a new miscellaneous transaction using funds directly
// from their savings
const EditUserForm: React.FC<Props> = ({ hideForm }): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const notify = (notification: string) => toast.success(notification);
  const errorNotify = (err: any) => toast.error(err);
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState: FormInfo = {
    title: "",
    value: 0,
    operation: "add",
    date: DateTime.now().toFormat("yyyy-MM-dd'T'T"),
  };
  const initalErrors: UserEditErrors = { title: "", value: "", date: "" };
  // sets state for initial form data
  const [formData, setFormData] = useState<FormInfo>(initialState);
  // reference hook for maximum value for new asset value
  const maxNum = useRef<number>(99999999999999);
  // sets state for input errors in form
  const [formErrors, setFormErrors] = useState<UserEditErrors>(initalErrors);
  // sets state for flashing inputs after attempting to submit errorful data in form
  const [flashInput, setFlashInput] = useState<flashErrors>({
    title: false,
    value: false,
    date: false,
  });

  // calcuates new asset value based on original asset value, the inputted monetary value to be added or
  // subtracted from the original, and the operation that changes with the press of a radio button. Used to
  // display on the form window for users.
  const newTotalAssets: string = useMemo<string>(() => {
    return calculateNewTotalAssetsUserDashboard(
      userStatus.user!.totalAssets,
      formData.value,
      formData.operation
    );
  }, [formData.value, formData.operation]);

  // updates the formdata state if the input that was changed was the title or date input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "title" || name === "date") {
      handleUserEditInputErrors(name, value, setFormErrors);
      setFormData((data) => ({ ...data, [name]: value }));
    }
  };

  // updates form data state when a user presses a key on keypad: pushes the number on the key to the right
  // most side of the current inputted value and handles input errors (input value too high or at $0.00)
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.value, num);
      if (
        !handleUserComparisons(
          newNum,
          setFormErrors,
          formData.operation,
          maxNum.current,
          userStatus.user!.totalAssets * 100
        )
      ) {
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

  // updates form data state when user clicks on delete key: pops the right-most number of the current added
  // asset value
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

  // updates form data state when user clicks on radio button: changes operation to either add or subtract.
  // If click error occurs (e.g. add value exceeds maximum value or subtract value exceeds original asset
  // value), neither button nor state changes
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

  // sends data to update to backend, sets new total asset value in redux state. If input errors occur,
  // (e.g. value to be added exceeds maximum value or value to be subtracted exceeds original asset
  // value), does not send data and erroneous inputs flash at user
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (handleEditUserSubmitErrors(formData, setFormErrors)) {
        const { value, operation } = formData;
        const submitData: UserEditInterface = {
          ...formData,
          value: operation === "add" ? +value / 100 : -value / 100,
        };
        await dispatch(addToAssets(submitData)).unwrap();
        hideForm(e);
        notify(createUpdateUserString(submitData));
      } else {
        if (formErrors.title || formData.title === "")
          setFlashInput((flash) => ({ ...flash, title: true }));
        if (formErrors.date || formData.date === "")
          setFlashInput((flash) => ({ ...flash, date: true }));
        if (formErrors.value || formData.value === 0)
          setFlashInput((flash) => ({ ...flash, value: true }));
        setTimeout(() => {
          setFlashInput({ title: false, date: false, value: false });
        }, 500);
      }
    } catch (err: any) {
      errorNotify(err);
    }
  };

  return !userStatus.smallLoading ? (
    <div tabIndex={-1} className="add-to-assets-form-div modal-layer-1">
      <div className="modal-layer-2-lg">
        <div className="add-to-assets-form text-center modal-layer-3">
          <header>
            <h1 className="text-3xl text-green-800 font-bold underline">
              Document a Miscellaneous Transaction
            </h1>
            <h2 className="text-lg">Your New Total Savings Value Will Be:</h2>
            <h2 className="text-4xl text-green-700 font-bold">
              ${newTotalAssets}
            </h2>
          </header>
          <form onSubmit={handleSubmit}>
            <div id="form_information" className="sm:flex sm:justify-center">
              <div id="title_and_date_inputs">
                <div className="transaction-title-div">
                  <label className="text-gray-700 block" htmlFor="title">
                    Transaction Title:{" "}
                  </label>
                  <input
                    className={`input sm:text-sm md:text-base ${
                      formErrors.title ? "input-error" : ""
                    } ${flashInput.title ? "animate-blinkError" : ""}`}
                    id="title"
                    type="text"
                    name="title"
                    placeholder="What is the reason for this transaction?"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {formErrors.title && (
                    <div className="error-message">
                      <p className="text-sm text-red-700 font-bold">
                        {formErrors.title}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <small>
                      Make sure your title has between 20 to 3 characters.
                    </small>
                    <small>
                      Your transaction title may only include letters, numbers,
                      and spaces.
                    </small>
                    <small> Spaces may only be between characters.</small>
                  </div>
                </div>
                <div className="date-div mb-2">
                  <label htmlFor="date" className="text-gray-700 text-lg block">
                    Transaction Date
                  </label>
                  <input
                    type="datetime-local"
                    className={`input  ${
                      formErrors.date ? "input-error" : "input-valid-date"
                    } ${flashInput.date && "animate-blinkError"}`}
                    id="expense_date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                  {formErrors.date && (
                    <div className="error-message">
                      <p className="text-sm text-red-700 font-bold">
                        {formErrors.date}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div id="transaction_inputs">
                <div className="added-assets-div">
                  <label className="text-gray-700 block" htmlFor="addedAssets">
                    What is the value of this transaction? ($ U.S.):{" "}
                  </label>
                  <input
                    className={`input sm:text-sm sm:w-64 md:text-base md:w-96  ${
                      formErrors.value ? "input-error" : ""
                    } ${flashInput.value ? "animate-blinkError" : ""}`}
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
                      <p className="text-sm text-red-700 font-bold">
                        {formErrors.value}
                      </p>
                    </div>
                  )}
                </div>
                <div className="keyPad-div p-2">
                  <KeyPad
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    num={formData.value}
                  />
                </div>
                <div className="edit-user-radio-buttons p-2">
                  <fieldset className="edit-user-choices">
                    <legend className="font-bold">
                      Does this transaction add to or subtract from your total
                      savings?
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
                        <label htmlFor="add">Add to Savings</label>
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
                        <label htmlFor="remove">Subtract from Savings</label>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>

            <div>
              <p>
                <small>
                  <span className="text-red-600">WARNING:</span> Once you submit
                  this transaction data, you will not be able to change or
                  delete any of it after the fact.
                </small>
              </p>
              <p>
                <small>
                  So make sure all of the above information is correct before
                  clicking "Add this Transaction"
                </small>
              </p>
              <div className="button-div flex justify-between">
                <div>
                  <button className="add-asset-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                    Add this Transaction
                  </button>
                </div>
                <div>
                  <button
                    className="cancel-button"
                    onClick={(e) => hideForm(e)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditUserForm;
