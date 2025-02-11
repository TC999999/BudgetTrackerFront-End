import { useState, useCallback, useMemo } from "react";
import {
  BudgetInterface,
  BudgetEditInterface,
} from "../interfaces/budgetInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getNewBudgetValue } from "../helpers/showBudgetValue";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { calculateNewTotalAssets } from "../helpers/calculateNewTotalAssets";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { updateBudget } from "../features/actions/budgets";
import SmallLoadingMsg from "../SmallLoadingMsg";

type Props = {
  hideEditForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: string
  ) => void;
  budget: BudgetInterface;
};

const EditBudgetForm: React.FC<Props> = ({ hideEditForm, budget }) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const remainingMoney: number = useMemo<number>(() => {
    return +getRemainingMoney(budget.moneyAllocated, budget.moneySpent) * 100;
  }, [budget]);

  const initialState: BudgetEditInterface = {
    title: budget.title,
    addedMoney: 0,
    operation: "add",
  };
  const [formData, setFormData] = useState<BudgetEditInterface>(initialState);
  const [keyPadErrorMessage, setKeyPadErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      if (newNum > remainingMoney && formData.operation === "subtract") {
        setKeyPadErrorMessage(
          "New funds cannot be more than remaining budget funds"
        );
      } else if (
        newNum > userStatus.user!.totalAssets * 100 &&
        formData.operation === "add"
      ) {
        setKeyPadErrorMessage("New funds cannot be more that total assets");
      } else {
        setFormData((data) => ({ ...data, addedMoney: newNum }));
      }
    },
    [formData, keyPadErrorMessage]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum = numPop(formData.addedMoney);
      setFormData((data) => ({
        ...data,
        addedMoney: newNum,
      }));
      if (keyPadErrorMessage) {
        setKeyPadErrorMessage("");
      }
    },
    [formData, keyPadErrorMessage]
  );

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (value === "subtract" && formData.addedMoney > remainingMoney) {
      setKeyPadErrorMessage(
        "New funds cannot be more than remaining budget funds"
      );
    } else if (
      value === "add" &&
      formData.addedMoney > userStatus.user!.totalAssets * 100
    ) {
      setKeyPadErrorMessage("New funds cannot be more that total assets");
    } else {
      setFormData((data) => ({
        ...data,
        [name]: value,
      }));
      if (keyPadErrorMessage) {
        setKeyPadErrorMessage("");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
    if (keyPadErrorMessage) {
      setKeyPadErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
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
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <SmallLoadingMsg />
  ) : (
    <div tabIndex={-1} className="budget-form-div modal-layer-1">
      <div className="edit-budget-form-div modal-layer-2">
        <div className="edit-budget-form modal-layer-3">
          <div className="headers text-center">
            <h2 className="text-2xl text-green-700 font-bold">
              Edit {budget.title} Budget
            </h2>
            <h3>Your New Total Asset Value Will Be</h3>
            <p className="text-green-700 text-3xl"> ${newTotalAssets}</p>
            <h3>Your New Total Budget Value Will Be</h3>
            <p className="text-green-700 text-3xl">{newBudget}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="title-div text-center mb-2">
              <label className="text-gray-700 text-lg block" htmlFor="title">
                Budget Title:{" "}
              </label>
              <input
                className="text-gray-900 text-xl text-center w-96 border-2 focus:outline-none focus:border-green-700"
                id="budget_title"
                type="text"
                name="title"
                placeholder="What's this budget for?"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="added-funds-div text-center mb-2">
              <label
                className="text-gray-700 text-lg block"
                htmlFor="addedMoney"
              >
                New Budget Funds($ U.S.):{" "}
              </label>
              <input
                className="text-gray-900 text-xl text-center w-96 border-2 focus:outline-none"
                id="added_budget_allocation"
                type="text"
                name="addedMoney"
                placeholder="0.00"
                value={`$${(formData.addedMoney / 100).toFixed(2)}`}
                required
                readOnly
              />
            </div>
            <div className="keyPad-div">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.addedMoney}
              />
            </div>

            <div className="keypad-error-message text-red-700 font-bold text-center">
              <p>{keyPadErrorMessage}</p>
            </div>

            <fieldset className="edit-budget-choices text-center">
              <legend className="font-bold">
                Are you adding or subtracting this amount from the total funds?
              </legend>
              <div>
                <input
                  type="radio"
                  id="add"
                  name="operation"
                  value="add"
                  onChange={handleRadio}
                  checked={formData.operation === "add"}
                />
                <label htmlFor="add">Add to Funds</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="remove"
                  name="operation"
                  value="subtract"
                  onChange={handleRadio}
                  checked={formData.operation === "subtract"}
                />
                <label htmlFor="remove">Subtract from Funds</label>
              </div>
            </fieldset>
            <div className="buttons flex justify-between m-2">
              <div className="submit-button">
                <button className="edit-budget-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                  Edit Budget
                </button>
              </div>
              <div className="cancel-button">
                <button onClick={(e) => hideEditForm(e, "showEditForm")}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetForm;
