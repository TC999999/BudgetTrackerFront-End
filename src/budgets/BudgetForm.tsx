import { useState, useCallback } from "react";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import {
  newBudgetInterface,
  BudgetFormErrors,
} from "../interfaces/budgetInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import {
  handleBudgetInputErrors,
  handleBudgetSubmitErrors,
} from "../helpers/handleBudgetErrors";
import { addNewBudget } from "../features/actions/budgets";
import { toast } from "react-toastify";

type Props = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
};

type flashErrors = {
  title: boolean;
  moneyAllocated: boolean;
};

// returns form for creating a new budget
const BudgetForm: React.FC<Props> = ({ hideForm }): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const notify = (title: string, moneyAllocated: number) =>
    toast.success(
      `${title} budget created successfully! $${moneyAllocated.toFixed(
        2
      )} allocated to this budget.`
    );
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState: newBudgetInterface = {
    title: "",
    moneyAllocated: 0,
  };
  const initialErrors: BudgetFormErrors = { title: "", moneyAllocated: "" };

  // sets state for new budget form data
  const [formData, setFormData] = useState<newBudgetInterface>(initialState);
  // sets state for available funds that changes if the new budget fund value changes
  const [availableFunds, setAvailableFunds] = useState<number>(
    userStatus.user!.totalAssets * 100
  );
  // sets state for errors in the form inputs, updates if errors are detcted
  const [formErrors, setFormErrors] = useState<BudgetFormErrors>(initialErrors);
  // sets state for if errors should be flashed if user attempts to submit errorful data
  const [flashInput, setFlashInput] = useState<flashErrors>({
    title: false,
    moneyAllocated: false,
  });

  // Pushes a number on the key pressed by the user to the right of the new budget funds value and creates
  // a new string. If the new budget value exceeds the user's current total asset value, the new budget funds
  // value will not update.
  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num: number = +e.currentTarget.value;
      let newNum: number = currencyConverter(formData.moneyAllocated, num);
      handleBudgetInputErrors("moneyAllocated", newNum, setFormErrors);
      if (newNum <= userStatus.user!.totalAssets * 100) {
        setFormData((data) => ({ ...data, moneyAllocated: newNum }));
        setAvailableFunds(userStatus.user!.totalAssets * 100 - newNum);
      } else {
        setFormErrors((data) => ({
          ...data,
          moneyAllocated:
            "Budget funds cannot exceed remaining total asset value!",
        }));
        setTimeout(() => {
          setFormErrors((data) => ({
            ...data,
            moneyAllocated: "",
          }));
        }, 1500);
      }
    },
    [formData]
  );

  // Pops the rightmost number on the new budget funds value and creates
  // a new string without that number.
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum: number = numPop(formData.moneyAllocated);
      handleBudgetInputErrors("moneyAllocated", newNum, setFormErrors);
      setFormData((data) => ({
        ...data,
        moneyAllocated: newNum,
      }));
      setAvailableFunds(userStatus.user!.totalAssets * 100 - newNum);
    },
    [formData]
  );

  // updates the values of the form data on user input. If the inputs contain any errors, updates form errors
  // state and lets user know that errors exist
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "title" || name === "moneyAllocated") {
      handleBudgetInputErrors(name, value, setFormErrors);
      setFormData((data) => ({ ...data, [name]: value }));
    }
  };

  // sends new budget info to db and updates user state in redux with new budget. If inputs contain errors on
  // submission, does not send data and flashes errorful inputs for user.
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (handleBudgetSubmitErrors(formData, setFormErrors)) {
        let submitData: newBudgetInterface = {
          ...formData,
          moneyAllocated: formData.moneyAllocated / 100,
        };
        await dispatch(addNewBudget(submitData)).unwrap();
        hideForm(e);
        notify(submitData.title, submitData.moneyAllocated);
      } else {
        if (formErrors.title || formData.title === "")
          setFlashInput((flash) => ({ ...flash, title: true }));
        if (formErrors.moneyAllocated || formData.moneyAllocated === 0)
          setFlashInput((flash) => ({ ...flash, moneyAllocated: true }));
        setTimeout(() => {
          setFlashInput({ title: false, moneyAllocated: false });
        }, 500);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return !userStatus.smallLoading ? (
    <div tabIndex={-1} className="budget-form-div modal-layer-1">
      <div className="modal-layer-2">
        <div className="new-budget-form modal-layer-3">
          <header className="headers text-center">
            <h1 className="text-3xl text-green-800 font-bold underline">
              Add a New Budget
            </h1>
            <h2 className="text-2xl mx-2">Available Funds:</h2>
            <h2 className="text-5xl font-bold text-green-700">
              ${(availableFunds / 100).toFixed(2)}
            </h2>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="title-div text-center mb-2">
              <label className="text-gray-700 block" htmlFor="title">
                Budget Title:
              </label>
              <input
                className={`input ${
                  formErrors.title ? "input-error" : "input-valid"
                } ${flashInput.title ? "animate-blinkError" : ""}`}
                id="budget_title"
                type="text"
                name="title"
                placeholder="What's this budget for?"
                value={formData.title}
                onChange={handleChange}
              />
              {formErrors.title && (
                <div className="error-message">
                  <p className="text-red-700 font-bold">{formErrors.title}</p>
                </div>
              )}
              <div className="flex flex-col">
                <small>
                  Make sure your title has between 20 to 3 characters.
                </small>
                <small>
                  Your budget title may only include letters, numbers, and
                  spaces.
                </small>
                <small> Spaces may only be between characters.</small>
              </div>
            </div>
            <div className="allocated-funds-div text-center mb-2">
              <label className="text-gray-700 block" htmlFor="moneyAllocated">
                Money Allocated ($ U.S.):
              </label>
              <input
                className={`input ${
                  formErrors.moneyAllocated ? "input-error" : ""
                } } ${flashInput.moneyAllocated ? "animate-blinkError" : ""}`}
                id="budget_allocation"
                type="text"
                name="moneyAllocated"
                placeholder="0.00"
                value={`$${(formData.moneyAllocated / 100).toFixed(2)}`}
                onChange={handleChange}
                required
                readOnly
              />
              <div>
                {formErrors.moneyAllocated && (
                  <div>
                    <p className="text-red-700 font-bold">
                      {formErrors.moneyAllocated}
                    </p>
                  </div>
                )}
                <small>
                  Make sure the funds for this budget does not exceed your
                  current available assets
                </small>
              </div>
            </div>
            <div className="keyPad-div">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.moneyAllocated}
              />
            </div>
            <div className="button flex justify-between m-2">
              <button className="add-budget-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900 duration-150">
                Add this Budget
              </button>
              <button
                className="bg-gray-600 text-gray-100 border-2 border-gray-900 rounded-full px-2 py-2 hover:bg-gray-200 hover:text-gray-600 duration-150"
                onClick={(e) => hideForm(e)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default BudgetForm;
