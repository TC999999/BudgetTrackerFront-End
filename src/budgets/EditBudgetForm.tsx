import { useState, useCallback, useMemo, useRef } from "react";
import {
  BudgetInterface,
  BudgetEditInterface,
  UpdateBudgetFormErrors,
} from "../interfaces/budgetInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getNewBudgetValue } from "../helpers/showBudgetValue";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { calculateNewTotalAssets } from "../helpers/calculateNewTotalAssets";
import { createUpdateBudgetString } from "../helpers/createNotificationString";
import {
  handleUpdateBudgetInputErrors,
  handleUpdateBudgetSubmitErrors,
  handleUpdateBudgetComparisons,
} from "../helpers/handleBudgetErrors";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { updateBudget } from "../features/actions/budgets";
import { toast } from "react-toastify";

type Props = {
  hideEditForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showEditForm"
  ) => void;
  budget: BudgetInterface;
};

type flashErrors = {
  title: boolean;
};

const EditBudgetForm: React.FC<Props> = ({
  hideEditForm,
  budget,
}): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const notify = (notificationString: string) =>
    toast.success(notificationString);
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  const initialState: BudgetEditInterface = {
    title: budget.title,
    addedMoney: 0,
    operation: "add",
  };
  const initialErrors: UpdateBudgetFormErrors = {
    title: "",
    addedMoney: "",
  };
  const [formData, setFormData] = useState<BudgetEditInterface>(initialState);
  const [formErrors, setFormErrors] =
    useState<UpdateBudgetFormErrors>(initialErrors);
  const [flashInput, setFlashInput] = useState<flashErrors>({ title: false });
  const remainingMoney = useRef<number>(
    +getRemainingMoney(budget.moneyAllocated, budget.moneySpent) * 100
  );

  const newRemainingMoney: string = useMemo<string>(() => {
    return getNewBudgetValue(
      (remainingMoney.current / 100).toFixed(2),
      formData.addedMoney,
      formData.operation
    );
  }, [formData]);

  const newBudget: string = useMemo<string>(() => {
    return getNewBudgetValue(
      budget.moneyAllocated,
      formData.addedMoney,
      formData.operation
    );
  }, [formData.addedMoney, formData.operation]);

  const newTotalAssets: string = useMemo<string>(() => {
    return calculateNewTotalAssets(
      userStatus.user!.totalAssets,
      formData.addedMoney,
      formData.operation
    );
  }, [formData.addedMoney, formData.operation]);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.addedMoney, num);

      let errors = handleUpdateBudgetComparisons(
        newNum,
        userStatus.user!.totalAssets * 100,
        formData.operation,
        remainingMoney.current,
        setFormErrors
      );
      if (!errors) {
        setFormData((data) => ({ ...data, addedMoney: newNum }));
      } else {
        setTimeout(() => {
          setFormErrors((data) => ({ ...data, addedMoney: "" }));
        }, 1500);
      }
    },
    [formData]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.addedMoney);
      setFormData((data) => ({
        ...data,
        addedMoney: newNum,
      }));
      if (formErrors.addedMoney)
        setFormErrors((data) => ({ ...data, addedMoney: "" }));
    },
    [formData]
  );

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (
      !handleUpdateBudgetComparisons(
        formData.addedMoney,
        userStatus.user!.totalAssets * 100,
        value,
        remainingMoney.current,
        setFormErrors
      )
    ) {
      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
    } else {
      setTimeout(() => {
        setFormErrors((data) => ({ ...data, addedMoney: "" }));
      }, 1500);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (name === "title" || name === "addedMoney") {
      handleUpdateBudgetInputErrors(name, value, setFormErrors);
      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    e.preventDefault();
    try {
      if (handleUpdateBudgetSubmitErrors(formData, setFormErrors)) {
        let submitData = {
          budgetID: budget._id,
          title: formData.title,
          addedMoney:
            formData.operation === "add"
              ? formData.addedMoney / 100
              : -formData.addedMoney / 100,
        };
        await dispatch(updateBudget(submitData)).unwrap();
        hideEditForm(e, "showEditForm");
        notify(createUpdateBudgetString(budget.title, formData));
      } else {
        if (formErrors.title || formData.title === "")
          setFlashInput({ title: true });
        setTimeout(() => {
          setFlashInput({ title: false });
        }, 500);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return !userStatus.smallLoading ? (
    <div tabIndex={-1} className="modal-layer-1">
      <div className="modal-layer-2-lg">
        <div className="edit-budget-form-div text-center modal-layer-3">
          <header>
            <h2 className="text-3xl text-green-800 font-bold underline">
              Edit {budget.title} Budget
            </h2>
          </header>
          <div className="info-and-form sm:flex sm:justify-center p-4">
            <div className="value-information sm:text-lg sm:m-2 sm:flex sm:items-center">
              <div className="sm:flex sm:flex-col justify-around sm:h-full w-full">
                <div className="sm:border-2 sm:p-4 sm:shadow-md">
                  <h3 className="text-md sm:text-2xl sm:underline">
                    Your New Total Asset Value Will Be
                  </h3>
                  <p className="text-green-700 text-3xl sm:text-4xl font-bold">
                    ${newTotalAssets}
                  </p>
                </div>
                <div className="sm:border-2 sm:p-4 sm:shadow-md">
                  <h3 className="text-md sm:text-2xl sm:underline">
                    {budget.title} Budget Will Have a New Total Value of
                  </h3>
                  <p className="text-green-700 text-3xl sm:text-4xl  font-bold">
                    {newBudget}
                  </p>
                </div>
                <div className="sm:border-2 sm:p-4 sm:shadow-md">
                  <h3 className="text-md sm:text-2xl sm:underline">
                    {budget.title} Budget Will Have a New Remaining Value of
                  </h3>
                  <p className="text-green-700 text-3xl sm:text-4xl  font-bold">
                    {newRemainingMoney}
                  </p>
                </div>
              </div>
            </div>
            <div className="edit-budget-form">
              <form>
                <div className="title-div mb-2">
                  <label
                    className="text-gray-700 text-lg block"
                    htmlFor="title"
                  >
                    Budget Title:{" "}
                  </label>
                  <input
                    className={`input ${
                      formErrors.title ? "input-error" : "input-valid"
                    } ${flashInput.title && "animate-blinkError"}`}
                    id="budget_title"
                    type="text"
                    name="title"
                    placeholder="What's this budget for?"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {formErrors.title && (
                    <div>
                      <p className="text-lg text-red-700 font-bold">
                        {formErrors.title}
                      </p>
                    </div>
                  )}

                  <small>
                    Make sure your title has between 20 to 3 characters
                  </small>
                </div>
                <div className="added-funds-div mb-2">
                  <label
                    className="text-gray-700 text-lg block"
                    htmlFor="moneyAllocated"
                  >
                    New Budget Funds($ U.S.):{" "}
                  </label>
                  <input
                    className={`input ${
                      formErrors.addedMoney ? "input-error" : ""
                    }`}
                    id="added_budget_allocation"
                    type="text"
                    name="moneyAllocated"
                    placeholder="0.00"
                    value={`$${(formData.addedMoney / 100).toFixed(2)}`}
                    readOnly
                  />
                  {formErrors.addedMoney && (
                    <div>
                      <p className="text-lg text-red-700 font-bold">
                        {formErrors.addedMoney}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <small>
                      If adding to budget, make sure new assets are equal to or
                      less than your available assets.
                    </small>
                    <small>
                      If subtracting from budget, make sure new assets are equal
                      to or greater than your remaining budget value.
                    </small>
                  </div>
                </div>
                <div className="keyPad-div">
                  <KeyPad
                    handlePress={handlePress}
                    handleDelete={handleDelete}
                    num={formData.addedMoney}
                  />
                </div>
                <div className="edit-budget-radio-buttons">
                  <fieldset className="edit-budget-choices">
                    <legend className="font-bold">
                      Are you adding or subtracting this amount from the total
                      funds?
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
              </form>
            </div>
          </div>
          <div className="buttons flex justify-between m-2">
            <div className="cancel-button">
              <button onClick={(e) => hideEditForm(e, "showEditForm")}>
                Cancel
              </button>
            </div>
            <div className="submit-button">
              <button
                onClick={(e) => handleSubmit(e)}
                className="edit-budget-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900"
              >
                Edit Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default EditBudgetForm;
