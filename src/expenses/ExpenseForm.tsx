import KeyPad from "../KeyPad";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import { BudgetInterface, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import useExpenseForm from "./hooks/useExpenseForm";
import { useMemo } from "react";
import { dollarConverter } from "../helpers/currencyConverter";
import Modal from "../motionWrappers/Modal";

type Props = {
  hideExpenseForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm"
  ) => void;
  budget: BudgetInterface;
  addExpense: (newExpense: ExpenseInterface) => void;
  updateBudget: (updatedBudget: BudgetUpdate) => void;
  show: boolean;
};

type conversion = {
  convertAvailableFunds: string;
  convertTransaction: string;
};

// returns form for adding a new expense for a single budget that belongs to a single user
const ExpenseForm: React.FC<Props> = ({
  hideExpenseForm,
  budget,
  addExpense,
  updateBudget,
  show,
}): JSX.Element | null => {
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const {
    formData,
    availableMoney,
    formErrors,
    flashErrors,
    handlePress,
    handleDelete,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useExpenseForm({
    budget,
    hideExpenseForm,
    addExpense,
    updateBudget,
  });

  const conversion: conversion = useMemo<conversion>(() => {
    return {
      convertAvailableFunds: dollarConverter(availableMoney),
      convertTransaction: dollarConverter(formData.transaction),
    };
  }, [availableMoney, formData.transaction]);

  return !formLoading ? (
    <Modal large={true} show={show}>
      <div id="new-expense-form">
        <header>
          <h2 className="text-3xl text-green-800 font-bold underline">
            Add a New Expense!
          </h2>
          <h2 className="text-lg">Remaining {budget.title} Budget Funds:</h2>
          <h2 className="text-4xl text-green-700 font-bold">
            {conversion.convertAvailableFunds}
          </h2>
        </header>
        <form onSubmit={handleSubmit}>
          <div id="input-divs" className="sm:flex sm:justify-center">
            <div id="title-and-date-div" className="sm:mx-2">
              <div id="title-div" className="mb-2">
                <label className="text-gray-700 text-lg block" htmlFor="title">
                  Expense Title:
                </label>
                <input
                  className={`input ${
                    formErrors.title ? "input-error" : "input-valid"
                  } ${flashErrors.title && "animate-blink-error"}`}
                  id="expense_title"
                  type="text"
                  name="title"
                  placeholder="What's this expense for?"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={30}
                />
                <div id="title-error-message">
                  <p className="text-red-700 sm:text-xs font-bold">
                    {formErrors.title}
                  </p>
                </div>
                <div className="flex flex-col">
                  <small>
                    Title length must be between 3 to 20 characters.
                  </small>
                  <small>Title may include any letters or numbers.</small>
                  <small>Spaces may only be between characters.</small>
                  <small>Allowed Special Characters: ("", '', -, :, /)</small>
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
                  } ${flashErrors.date && "animate-blink-error"}`}
                  id="expense_date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
                <div id="date-error-message">
                  <p className="text-red-700 sm:text-xs font-bold">
                    {formErrors.date}
                  </p>
                </div>
              </div>
            </div>
            <div id="transaction-and-keypad-div" className="sm:mx-2">
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
                  } ${flashErrors.transaction && "animate-blink-error"}`}
                  id="expense_transaction"
                  type="text"
                  name="trasaction"
                  placeholder="$0.00"
                  value={conversion.convertTransaction}
                  readOnly
                />
                <div id="transaction-error-message">
                  <p className="text-red-700 sm:text-xs font-bold">
                    {formErrors.transaction}
                  </p>
                </div>
                <small>
                  Expense value may not exceed remaining funds for{" "}
                  {budget.title}
                </small>
              </div>
              <div id="keyPad-div">
                <KeyPad
                  handlePress={handlePress}
                  handleDelete={handleDelete}
                  num={formData.transaction}
                />
              </div>
            </div>
          </div>
          <div id="button-div" className="flex justify-between m-2">
            <button
              id="cancel-button"
              className="cancel-button"
              onClick={(e) => handleCancel(e)}
            >
              Cancel
            </button>
            <button id="add-expense-button" className="submit-button">
              Add this Expense
            </button>
          </div>
        </form>
      </div>
    </Modal>
  ) : null;
};

export default ExpenseForm;
