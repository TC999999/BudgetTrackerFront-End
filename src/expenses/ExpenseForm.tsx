import { useState } from "react";
import KeyPad from "../budgets/KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { addToAssets } from "../features/auth/authSlice";
import { newExpenseInterface } from "../interfaces/expenseInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { BudgetInterface } from "../interfaces/budgetInterfaces";

interface Props {
  hideForm: any;
  budget: BudgetInterface | null;
}

const ExpenseForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const initialState: newExpenseInterface = {
    title: "",
    date: null,
    transaction: 0,
  };
  const [formData, setFormData] = useState(initialState);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const initialMoney = getRemainingMoney(
    props.budget?.moneyAllocated || "",
    props.budget?.moneySpent || 0
  );
  const [originalMoney, setOriginalMoney] = useState<string>(initialMoney);
  const [availableMoney, setAvailableMoney] = useState<string>(initialMoney);

  const hide = () => {
    props.hideForm();
  };

  const handlePress = (num: number) => {
    let newNum = currencyConverter(formData.transaction, num);
    let newAvailableMoney = parseFloat(originalMoney) * 100 - newNum;
    if (newNum < newAvailableMoney) {
      setFormData((data) => ({
        ...data,
        transaction: newNum,
      }));
      setAvailableMoney((newAvailableMoney / 100).toFixed(2));
    } else {
      setKeyPadError(true);
    }
  };

  const handleDelete = () => {
    let newNum = numPop(formData.transaction);
    setFormData((data) => ({
      ...data,
      transaction: newNum,
    }));
    if (keyPadError) {
      setKeyPadError(false);
    }
    let newAvailableMoney = parseFloat(originalMoney) * 100 - newNum;
    setAvailableMoney((newAvailableMoney / 100).toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let date = new Date().toLocaleDateString();

    let submitData = {
      ...formData,
      budgetID: props.budget?._id,
      userID: userStatus.user._id,

      date,
      transaction: formData.transaction / 100,
    };
    console.log(submitData);
  };
  return (
    <div>
      <h2>Expense Form</h2>
      <h2>Available Budget: ${availableMoney}</h2>
      <form onSubmit={handleSubmit}>
        <div className="title-div">
          <label htmlFor="title">Expense Title: </label>
          <input
            id="expense_title"
            type="text"
            name="title"
            placeholder="What's this expense for?"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="transaction-div">
          <label htmlFor="transaction">Transaction Value ($ U.S.): </label>
          <input
            id="expense_transaction"
            type="text"
            name="trasaction"
            placeholder="0.00"
            value={(formData.transaction / 100).toFixed(2)}
            onChange={handleChange}
            required
            readOnly
          />
        </div>
        <div className="keyPad-div">
          <KeyPad
            handlePress={handlePress}
            handleDelete={handleDelete}
            num={formData.transaction}
          />
        </div>
        {keyPadError && (
          <div className="error-message">
            {keyPadError && (
              <p>Expense transaction value cannot exceed available budget</p>
            )}
          </div>
        )}
        <div className="button-div">
          <button className="add-expense-button">Add this Expense</button>
        </div>
        <div className="error-message">
          {userStatus.error && <p>{userStatus.error}</p>}
        </div>
      </form>
      <button onClick={hide}>Cancel</button>
    </div>
  );
};

export default ExpenseForm;
