import { useState, useRef, useCallback } from "react";
import KeyPad from "../KeyPad";
import { useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { newExpenseInterface } from "../interfaces/expenseInterfaces";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { addNewExpense } from "../features/actions/expenses";
import SmallLoadingMsg from "../SmallLoadingMsg";

type Props = {
  hideExpenseForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: string
  ) => void;
  budget: BudgetInterface;
};

const ExpenseForm: React.FC<Props> = ({ hideExpenseForm, budget }) => {
  const dispatch = useAppDispatch();
  const initialState: newExpenseInterface = {
    title: "",
    transaction: 0,
  };
  const initialMoney: string = getRemainingMoney(
    budget?.moneyAllocated || "",
    budget?.moneySpent || 0
  );
  const [formData, setFormData] = useState<newExpenseInterface>(initialState);
  const [keyPadError, setKeyPadError] = useState<boolean>(false);
  const originalMoney = useRef<string>(initialMoney);
  const [availableMoney, setAvailableMoney] = useState<string>(initialMoney);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState(new Map<string, string>());

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (formErrors.get("transaction")) {
        formErrors.delete("transaction");
      }
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.transaction, num);
      let original = parseFloat(originalMoney.current) * 100;
      if (newNum <= original) {
        let newAvailableMoney = original - newNum;
        setFormData((data) => ({
          ...data,
          transaction: newNum,
        }));
        setAvailableMoney((newAvailableMoney / 100).toFixed(2));
      } else {
        setKeyPadError(true);
      }
    },
    [formData, keyPadError, formErrors]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (formErrors.get("transaction")) {
        formErrors.delete("transaction");
      }

      let newNum: number = numPop(formData.transaction);
      setFormData((data) => ({
        ...data,
        transaction: newNum,
      }));
      if (keyPadError) {
        setKeyPadError(false);
      }
      let newAvailableMoney = parseFloat(originalMoney.current) * 100 - newNum;
      setAvailableMoney((newAvailableMoney / 100).toFixed(2));
    },
    [formData, keyPadError, formErrors]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (formErrors.get("title")) {
      formErrors.delete("title");
    }
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let submitData = {
        ...formData,
        budgetID: budget?._id,
        transaction: formData.transaction / 100,
      };
      await dispatch(addNewExpense(submitData)).unwrap();
      hideExpenseForm(e, "showExpenseForm");
    } catch (err) {
      setIsLoading(false);
      if (Array.isArray(err)) {
        setFormErrors(new Map(err));
      }
    }
  };

  return isLoading ? (
    <SmallLoadingMsg />
  ) : (
    <div tabIndex={-1} className="new-expense-form-div modal-layer-1">
      <div className="modal-layer-2">
        <div className="new-expense-form modal-layer-3">
          <h2 className="text-2xl text-green-700 text-center">
            Add a New Expense!
          </h2>
          <div className="available-funds text-lg text-center">
            <h2>Available {budget.title} Budget Funds:</h2>
            <h2>${availableMoney}</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="title-div text-center mb-2">
              <label className="text-gray-700 text-lg block" htmlFor="title">
                Expense Title:
              </label>
              <input
                className="text-gray-900 text-center text-xl w-96 border-2 focus:outline-none focus:border-green-700"
                id="expense_title"
                type="text"
                name="title"
                placeholder="What's this expense for?"
                value={formData.title}
                onChange={handleChange}
              />
              {formErrors.get("title") && (
                <div className="error-message">
                  <p className="text-red-700 font-bold">
                    {formErrors.get("title")}
                  </p>
                </div>
              )}
            </div>
            <div className="transaction-div text-center mb-2">
              <label
                htmlFor="transaction"
                className="text-gray-700 text-lg block"
              >
                Transaction Value ($ U.S.):
              </label>
              <input
                className="text-gray-900 text-xl text-center w-96 focus:outline-none "
                id="expense_transaction"
                type="text"
                name="trasaction"
                placeholder="0.00"
                value={`$${(formData.transaction / 100).toFixed(2)}`}
                readOnly
              />
              {formErrors.get("transaction") && (
                <div className="error-message">
                  <p className="text-red-700 font-bold">
                    {formErrors.get("transaction")}
                  </p>
                </div>
              )}
            </div>

            <div className="keyPad-div">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.transaction}
              />
            </div>
            {keyPadError && (
              <div className="error-message text-center">
                <p className="text-red-700 font-bold">
                  Expense transaction value cannot exceed available budget
                </p>
              </div>
            )}
            <div className="button-div flex justify-between m-2">
              <button className="add-expense-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                Add this Expense
              </button>
              <button
                className="cancel-button"
                onClick={(e) => hideExpenseForm(e, "showExpenseForm")}
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

export default ExpenseForm;
