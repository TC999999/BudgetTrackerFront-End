import { useState } from "react";
import KeyPad from "./KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { newBudgetInterface } from "../interfaces/budgetInterfaces";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { UserEditInterface } from "../interfaces/userInterfaces";
import { addToAssets, addNewBudget } from "../features/auth/authSlice";

interface Props {
  hideForm: any;
}

const BudgetForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialState: newBudgetInterface = {
    title: "",
    moneyAllocated: 0,
  };
  const [formData, setFormData] = useState(initialState);
  const [availableFunds, setAvailableFunds] = useState(
    (userStatus.user.totalAssets || 1) * 100
  );

  const [keyPadError, setKeyPadError] = useState<boolean>(false);

  const handlePress = (num: number) => {
    let newNum = currencyConverter(formData.moneyAllocated, num);

    let currency = (newNum / 100).toFixed(2);
    if (parseFloat(currency) < (userStatus.user?.totalAssets ?? 1)) {
      setFormData((data) => ({ ...data, moneyAllocated: newNum }));
      setAvailableFunds((userStatus.user.totalAssets || 1) * 100 - newNum);
    } else {
      setKeyPadError(true);
    }
  };

  const handleDelete = () => {
    let newNum = numPop(formData.moneyAllocated);
    setFormData((data) => ({
      ...data,
      moneyAllocated: newNum,
    }));
    setAvailableFunds((userStatus.user.totalAssets || 1) * 100 - newNum);
    if (keyPadError) {
      setKeyPadError(false);
    }
  };

  const hide = () => {
    props.hideForm();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let submitData = {
        ...formData,
        username: userStatus.user.username || "",
        moneyAllocated: formData.moneyAllocated / 100,
      };

      const updateFunds: UserEditInterface = {
        username: userStatus.user.username || "",
        newAssets: availableFunds / 100,
      };

      await dispatch(addNewBudget(submitData)).unwrap();
      await dispatch(addToAssets(updateFunds)).unwrap();
      hide();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="budget-form">
      <h1>Add a New Budget Form</h1>
      <h2>Available Funds: ${(availableFunds / 100).toFixed(2)}</h2>
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
        <div className="allocated-funds-div">
          <label htmlFor="moneyAllocated">Money Allocated ($ U.S.): </label>
          <input
            id="budget_allocation"
            type="text"
            name="moneyAllocated"
            placeholder="0.00"
            value={(formData.moneyAllocated / 100).toFixed(2)}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="keyPad-div">
          <KeyPad
            handlePress={handlePress}
            handleDelete={handleDelete}
            num={formData.moneyAllocated}
          />
        </div>
        {keyPadError && (
          <div className="error-message">
            {keyPadError && <p>budget funds cannot exceed total asset value</p>}
          </div>
        )}
        <div className="button-div">
          <button className="add-budget-button">Add this Budget</button>
        </div>
        <div className="error-message">
          {userStatus.error && <p>{userStatus.error}</p>}
        </div>
      </form>
      <button onClick={hide}>Cancel</button>
    </div>
  );
};

export default BudgetForm;
