import { useState, useRef, useCallback } from "react";
import KeyPad from "../KeyPad";
import { useAppDispatch } from "../features/hooks";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import {
  handleExpenseInputErrors,
  handleExpenseSubmitErrors,
} from "../helpers/handleExpenseErrors";
import {
  newExpenseInterface,
  ExpenseFormErrors,
} from "../interfaces/expenseInterfaces";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { addNewExpense } from "../features/actions/expenses";
import SmallLoadingMsg from "../SmallLoadingMsg";
import { DateTime } from "luxon";

type flashErrors = { title: boolean; transaction: boolean; date: boolean };

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
    date: DateTime.now().toFormat("yyyy-MM-dd'T'T"),
  };
  const initialMoney: string = getRemainingMoney(
    budget?.moneyAllocated || "",
    budget?.moneySpent || 0
  );
  const initialErrors: ExpenseFormErrors = {
    title: "",
    transaction: "",
    date: "",
  };
  const [formData, setFormData] = useState<newExpenseInterface>(initialState);
  const originalMoney = useRef<string>(initialMoney);
  const [availableMoney, setAvailableMoney] = useState<string>(initialMoney);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] =
    useState<ExpenseFormErrors>(initialErrors);

  const [flashInput, setFlashInput] = useState<flashErrors>({
    title: false,
    transaction: false,
    date: false,
  });

  const handlePress = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let num = +e.currentTarget.value;
      let newNum = currencyConverter(formData.transaction, num);
      handleExpenseInputErrors("transaction", newNum, setFormErrors);
      let original = parseFloat(originalMoney.current) * 100;
      if (newNum <= original) {
        let newAvailableMoney = original - newNum;
        setFormData((data) => ({
          ...data,
          transaction: newNum,
        }));
        setAvailableMoney((newAvailableMoney / 100).toFixed(2));
      } else {
        setFormErrors((data) => ({
          ...data,
          transaction:
            "Expense transaction value cannot exceed available budget",
        }));
        setTimeout(() => {
          setFormErrors((data) => ({
            ...data,
            transaction: "",
          }));
        }, 1500);
      }
    },
    [formData, formErrors]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      let newNum: number = numPop(formData.transaction);
      handleExpenseInputErrors("transaction", newNum, setFormErrors);
      setFormData((data) => ({
        ...data,
        transaction: newNum,
      }));
      let newAvailableMoney = parseFloat(originalMoney.current) * 100 - newNum;
      setAvailableMoney((newAvailableMoney / 100).toFixed(2));
    },
    [formData, formErrors]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    handleExpenseInputErrors(name, value, setFormErrors);
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (handleExpenseSubmitErrors(formData, setFormErrors)) {
        setIsLoading(true);
        let submitData = {
          ...formData,
          budgetID: budget?._id,
          transaction: formData.transaction / 100,
        };
        await dispatch(addNewExpense(submitData)).unwrap();
        hideExpenseForm(e, "showExpenseForm");
      } else {
        if (formErrors.title || formData.title === "")
          setFlashInput((flash) => ({ ...flash, title: true }));
        if (formErrors.date || formData.date === "")
          setFlashInput((flash) => ({ ...flash, date: true }));

        if (formErrors.transaction || formData.transaction === 0)
          setFlashInput((flash) => ({ ...flash, transaction: true }));

        setTimeout(() => {
          setFlashInput({ title: false, date: false, transaction: false });
        }, 500);
      }
    } catch (err) {
      setIsLoading(false);
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
          <div className="available-funds  text-center">
            <h2 className="text-lg">Remaining {budget.title} Budget Funds:</h2>
            <h2 className="text-3xl text-emerald-800 font-bold">
              ${availableMoney}
            </h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="title-div text-center mb-2">
              <label className="text-gray-700 text-lg block" htmlFor="title">
                Expense Title:
              </label>
              <input
                className={`input ${
                  formErrors.title ? "input-error" : "input-valid"
                } ${flashInput.title && "animate-blinkError"}`}
                id="expense_title"
                type="text"
                name="title"
                placeholder="What's this expense for?"
                value={formData.title}
                onChange={handleChange}
                maxLength={30}
              />
              {formErrors.title && (
                <div className="error-message">
                  <p className="text-red-700 font-bold">{formErrors.title}</p>
                </div>
              )}
            </div>
            <div className="date-div text-center mb-2">
              <label htmlFor="date" className="text-gray-700 text-lg block">
                When was this transaction made?
              </label>
              <input
                type="datetime-local"
                className={`input ${
                  formErrors.date ? "input-error" : "input-valid-date"
                } ${flashInput.date && "animate-blinkError"}`}
                id="expense_date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {formErrors.date && (
                <div className="error-message">
                  <p className="text-red-700 font-bold">{formErrors.date}</p>
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
                className={`input ${
                  formErrors.transaction ? "input-error" : ""
                } ${flashInput.transaction && "animate-blinkError"}`}
                id="expense_transaction"
                type="text"
                name="trasaction"
                placeholder="0.00"
                value={`$${(formData.transaction / 100).toFixed(2)}`}
                readOnly
              />
              {formErrors.transaction && (
                <div className="error-message">
                  <p className="text-red-700 font-bold">
                    {formErrors.transaction}
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
