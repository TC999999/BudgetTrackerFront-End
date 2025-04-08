import { useState, useRef, useCallback } from "react";
import KeyPad from "../KeyPad";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { setSmallLoading } from "../features/auth/authSlice";
import { currencyConverter, numPop } from "../helpers/currencyConverter";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import {
  handleExpenseInputErrors,
  handleExpenseSubmitErrors,
} from "../helpers/handleExpenseErrors";
import {
  newExpenseInterface,
  ExpenseFormErrors,
  submitNewExpense,
  ExpenseInterface,
} from "../interfaces/expenseInterfaces";
import { BudgetInterface, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { DateTime } from "luxon";
import { toast } from "react-toastify";
import ExpenseAPI from "../apis/ExpenseAPI";

type flashErrors = { title: boolean; transaction: boolean; date: boolean };

type Props = {
  hideExpenseForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm"
  ) => void;
  budget: BudgetInterface;
  addExpense: (newExpense: ExpenseInterface) => void;
  updateBudget: (updatedBudget: BudgetUpdate) => void;
};

const ExpenseForm: React.FC<Props> = ({
  hideExpenseForm,
  budget,
  addExpense,
  updateBudget,
}): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const notify = (title: string, transaction: number) =>
    toast.success(
      `${title} expense created successfully! $${transaction.toFixed(
        2
      )} spent. $${availableMoney} remaining in ${budget.title}.`
    );
  const userStatus = useAppSelector((store) => store.user.userInfo);

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

  // sets ref for the original amount of remaining money that the budget for this expense has
  const originalMoney = useRef<string>(initialMoney);
  // form data state for new expense
  const [formData, setFormData] = useState<newExpenseInterface>(initialState);
  // sets state for the changing amount of remaining money that the budget for this expense has if expense
  // was to be applied
  const [availableMoney, setAvailableMoney] = useState<string>(initialMoney);
  // sets error strings for expense form to be shown to user
  const [formErrors, setFormErrors] =
    useState<ExpenseFormErrors>(initialErrors);

  // booleans for form errors to be flashed on submission
  const [flashInput, setFlashInput] = useState<flashErrors>({
    title: false,
    transaction: false,
    date: false,
  });

  // pushes number on the key clicked by user to the right side of the new expense's transaction value and
  // returns a new string
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

  // pops number from the right side of the new expense's transaction value and
  // returns a new string
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

  // updates form data values based on user input, if input contains errors (e.g. expense title too long),
  // updates form error state and lets user know
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    handleExpenseInputErrors(name, value, setFormErrors);
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // sends new expense data to backend to be added to db and updates user state. If any inputs
  // contain errors, does not send data and flashes errorful inputs
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (handleExpenseSubmitErrors(formData, setFormErrors)) {
        dispatch(setSmallLoading(true));
        let submitData: submitNewExpense = {
          ...formData,
          budgetID: budget?._id,
          transaction: formData.transaction / 100,
        };
        const { spentMoney, newExpense } = await ExpenseAPI.addNewExpense(
          submitData,
          userStatus.user!._id
        );
        addExpense(newExpense);
        updateBudget(spentMoney);
        hideExpenseForm(e, "showExpenseForm");
        notify(submitData.title, submitData.transaction);
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
      console.log(err);
    } finally {
      dispatch(setSmallLoading(false));
    }
  };

  return !userStatus.smallLoading ? (
    <div tabIndex={-1} className="new-expense-form-div modal-layer-1">
      <div className="modal-layer-2">
        <div className="new-expense-form modal-layer-3 text-center">
          <header>
            <h2 className="text-3xl text-green-800 font-bold underline">
              Add a New Expense!
            </h2>
            <h2 className="text-lg">Remaining {budget.title} Budget Funds:</h2>
            <h2 className="text-4xl text-green-700 font-bold">
              ${availableMoney}
            </h2>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="title-div mb-2">
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
              <div className="flex flex-col">
                <small>
                  Make sure your title has between 20 to 3 characters.
                </small>
                <small>
                  Your new expense title may only include letters, numbers, and
                  spaces.
                </small>
                <small>Spaces may only be between characters.</small>
              </div>
            </div>
            <div className="date-div mb-2">
              <label htmlFor="date" className="text-gray-700 text-lg block">
                Expense Date
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
            <div className="transaction-div mb-2">
              <label
                htmlFor="transaction"
                className="text-gray-700 text-lg block"
              >
                Expense Value ($ U.S.):
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
              <small>
                Expense may not exceed remaining funds for {budget.title}
              </small>
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
  ) : null;
};

export default ExpenseForm;
