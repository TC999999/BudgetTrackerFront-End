import { useState, useCallback, useMemo } from "react";
import {
  BudgetInterface,
  BudgetEditInterface,
} from "../interfaces/budgetInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import {
  addBudgetValue,
  subtractBudgetValue,
} from "../helpers/showBudgetValue";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { calculateNewTotalAssets } from "../helpers/calculateNewTotalAssets";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { updateBudget } from "../features/actions/budgets";
import SmallLoadingMsg from "../SmallLoadingMsg";

interface Props {
  hideEditForm: any;
  budget: BudgetInterface;
}

const EditBudgetForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const remainingMoney = useMemo(() => {
    return (
      +getRemainingMoney(props.budget.moneyAllocated, props.budget.moneySpent) *
      100
    );
  }, [props.budget]);

  const initialState: BudgetEditInterface = {
    title: props.budget.title,
    addedMoney: 0,
    operation: "add",
  };
  const [formData, setFormData] = useState<BudgetEditInterface>(initialState);
  const [keyPadErrorMessage, setKeyPadErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const newAddBudget = useMemo(() => {
    return addBudgetValue(props.budget.moneyAllocated, formData.addedMoney);
  }, [formData.addedMoney]);

  const newSubtractBudget = useMemo(() => {
    return subtractBudgetValue(
      props.budget.moneyAllocated,
      formData.addedMoney
    );
  }, [formData.addedMoney]);

  const newTotalAssets = useMemo(() => {
    return calculateNewTotalAssets(
      userStatus.user.totalAssets || 1,
      formData.addedMoney,
      formData.operation
    );
  }, [formData]);

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.addedMoney, num);
      console.log((userStatus.user.totalAssets || 1) * 100);
      if (newNum > remainingMoney && formData.operation === "subtract") {
        setKeyPadErrorMessage(
          "New funds cannot be more than remaining budget funds"
        );
      } else if (
        newNum > (userStatus.user.totalAssets || 1) * 100 &&
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
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "subtract" && formData.addedMoney > remainingMoney) {
      setKeyPadErrorMessage(
        "New funds cannot be more than remaining budget funds"
      );
    } else if (
      value === "add" &&
      formData.addedMoney > (userStatus.user.totalAssets || 1) * 100
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
    if (keyPadErrorMessage) {
      setKeyPadErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let submitData = {
        budgetID: props.budget._id,
        title: formData.title,
        addedMoney:
          formData.operation === "add"
            ? formData.addedMoney / 100
            : -formData.addedMoney / 100,
      };
      await dispatch(updateBudget(submitData)).unwrap();
      props.hideEditForm(e, "showEditForm");
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-budget-form-div">
      {isLoading ? (
        <SmallLoadingMsg />
      ) : (
        <div className="edit-budget-form">
          <h2>Edit Budget {props.budget.title}</h2>
          <h3>Your New Total Asset Value Will Be ${newTotalAssets}</h3>
          <form onSubmit={handleSubmit}>
            <div className="title-div">
              <label htmlFor="title">Budget Title: </label>
              <input
                id="budget_title"
                type="text"
                name="title"
                placeholder="What's this budget for?"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="added-funds-div">
              <label htmlFor="addedMoney">New Budget Funds($ U.S.): </label>
              <input
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

            <div className="error-message">
              <p>{keyPadErrorMessage}</p>
            </div>

            <fieldset className="edit-budget-choices">
              <legend>
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
                <label htmlFor="add">
                  {/* Return all funds (${props.budget.moneyAllocated}) */}
                  Add to Funds ({newAddBudget})
                </label>
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
                <label htmlFor="remove">
                  Subtract from Funds ({newSubtractBudget})
                </label>
              </div>
            </fieldset>
            <div className="button-div">
              <button className="edit-budget-button">Edit Budget</button>
            </div>
            <div className="error-message">
              {userStatus.error && <p>{userStatus.error}</p>}
            </div>
          </form>
        </div>
      )}
      <button onClick={(e) => props.hideEditForm(e, "showEditForm")}>
        Cancel
      </button>
    </div>
  );
};

export default EditBudgetForm;
