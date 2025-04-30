import KeyPad from "../KeyPad";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import {
  newExpenseInterface,
  ExpenseFormErrors,
  ExpenseInterface,
  ExpenseFlashErrors,
} from "../interfaces/expenseInterfaces";
import { BudgetInterface, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import useExpenseForm from "./hooks/useExpenseForm";
import { DateTime } from "luxon";

type Props = {
  hideExpenseForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm"
  ) => void;
  budget: BudgetInterface;
  addExpense: (newExpense: ExpenseInterface) => void;
  updateBudget: (updatedBudget: BudgetUpdate) => void;
};

// returns form for adding a new expense for a single budget that belongs to a single user
const ExpenseForm: React.FC<Props> = ({
  hideExpenseForm,
  budget,
  addExpense,
  updateBudget,
}): JSX.Element | null => {
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

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

  const initialFlashErrors: ExpenseFlashErrors = {
    title: false,
    transaction: false,
    date: false,
  };

  const {
    formData,
    availableMoney,
    formErrors,
    flashErrors,
    handlePress,
    handleDelete,
    handleChange,
    handleSubmit,
  } = useExpenseForm({
    initialState,
    initialMoney,
    initialErrors,
    initialFlashErrors,
    budget,
    hideExpenseForm,
    addExpense,
    updateBudget,
  });

  return !formLoading ? (
    <div tabIndex={-1} id="new-expense-form-div" className="modal-layer-1">
      <div className="modal-layer-2">
        <div id="new-expense-form" className="modal-layer-3 text-center">
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
            <div id="title-div" className="mb-2">
              <label className="text-gray-700 text-lg block" htmlFor="title">
                Expense Title:
              </label>
              <input
                className={`input ${
                  formErrors.title ? "input-error" : "input-valid"
                } ${flashErrors.title && "animate-blinkError"}`}
                id="expense_title"
                type="text"
                name="title"
                placeholder="What's this expense for?"
                value={formData.title}
                onChange={handleChange}
                maxLength={30}
              />
              {formErrors.title && (
                <div id="title-error-message">
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
            <div id="date-div" className="mb-2">
              <label htmlFor="date" className="text-gray-700 text-lg block">
                Expense Date
              </label>
              <input
                type="datetime-local"
                className={`input ${
                  formErrors.date ? "input-error" : "input-valid-date"
                } ${flashErrors.date && "animate-blinkError"}`}
                id="expense_date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
              {formErrors.date && (
                <div id="date-error-message">
                  <p className="text-red-700 font-bold">{formErrors.date}</p>
                </div>
              )}
            </div>
            <div id="transaction-div" className="mb-2">
              <label
                htmlFor="transaction"
                className="text-gray-700 text-lg block"
              >
                Expense Value ($ U.S.):
              </label>
              <input
                className={`input ${
                  formErrors.transaction ? "input-error" : ""
                } ${flashErrors.transaction && "animate-blinkError"}`}
                id="expense_transaction"
                type="text"
                name="trasaction"
                placeholder="0.00"
                value={`$${(formData.transaction / 100).toFixed(2)}`}
                readOnly
              />
              {formErrors.transaction && (
                <div id="transaction-error-message">
                  <p className="text-red-700 font-bold">
                    {formErrors.transaction}
                  </p>
                </div>
              )}
              <small>
                Expense may not exceed remaining funds for {budget.title}
              </small>
            </div>
            <div id="keyPad-div">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.transaction}
              />
            </div>

            <div id="button-div" className="flex justify-between m-2">
              <button
                className="cancel-button"
                onClick={(e) => hideExpenseForm(e, "showExpenseForm")}
              >
                Cancel
              </button>
              <button id="add-expense-button" className="submit-button">
                Add this Expense
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default ExpenseForm;
