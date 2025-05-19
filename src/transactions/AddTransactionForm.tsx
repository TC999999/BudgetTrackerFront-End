import { useMemo } from "react";
import { loading } from "../interfaces/loadingInterfaces";
import { Transaction } from "../interfaces/transactionInterfaces";
import KeyPad from "../KeyPad";
import Modal from "../motionWrappers/Modal";
import useAddTransaction from "./hooks/useAddTransaction";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { dollarConverter } from "../helpers/currencyConverter";

type Props = {
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
  updateTransactions: (newTransaction: Transaction) => void;
  show: boolean;
};

type conversion = {
  convertNewTotalAssets: string;
  convertNewValue: string;
};

// returns form modal for users to add a new miscellaneous transaction using funds directly
// from their savings
const AddTransactionForm: React.FC<Props> = ({
  hideForm,
  updateTransactions,
  show,
}): JSX.Element | null => {
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const {
    formData,
    formErrors,
    flashErrors,
    newTotalAssets,
    handleChange,
    handlePress,
    handleDelete,
    handleRadio,
    handleSubmit,
  } = useAddTransaction({
    hideForm,
    updateTransactions,
  });

  const conversion: conversion = useMemo<conversion>(() => {
    return {
      convertNewTotalAssets: dollarConverter(newTotalAssets),
      convertNewValue: dollarConverter(formData.value),
    };
  }, [newTotalAssets, formData.value]);

  return !formLoading ? (
    <Modal show={show} large={true}>
      <header>
        <h1 className="text-3xl text-green-800 font-bold underline">
          Document a Miscellaneous Transaction
        </h1>
        <h2 className="text-lg">Your New Total Savings Value Will Be:</h2>
        <h2 className="text-4xl text-green-700 font-bold">
          {conversion.convertNewTotalAssets}
        </h2>
      </header>
      <form onSubmit={handleSubmit}>
        <div id="form_information" className="sm:flex sm:justify-center">
          <div id="title_and_date_inputs">
            <div className="transaction-title-div">
              <label className="text-gray-700 block" htmlFor="title">
                Transaction Title:{" "}
              </label>
              <input
                className={`input sm:text-sm md:text-base ${
                  formErrors.title ? "input-error" : "input-valid"
                } ${flashErrors.title ? "animate-blink-error" : ""}`}
                id="title"
                type="text"
                name="title"
                placeholder="What is the reason for this transaction?"
                value={formData.title}
                onChange={handleChange}
              />
              {formErrors.title && (
                <div className="error-message">
                  <p className="text-sm text-red-700 font-bold">
                    {formErrors.title}
                  </p>
                </div>
              )}
              <div className="flex flex-col">
                <small>Title length must be between 20 to 3 characters.</small>
                <small>Title may include any letters or numbers.</small>
                <small>Spaces may only be between characters.</small>
                <small>Allowed Special Characters: ("", '', -, :, /)</small>
              </div>
            </div>
            <div className="date-div mb-2">
              <label htmlFor="date" className="text-gray-700 text-lg block">
                Transaction Date
              </label>
              <input
                type="datetime-local"
                className={`input  ${
                  formErrors.date ? "input-error" : "input-valid-date"
                } ${flashErrors.date && "animate-blink-error"}`}
                id="expense_date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                readOnly
              />
              {formErrors.date && (
                <div className="error-message">
                  <p className="text-sm text-red-700 font-bold">
                    {formErrors.date}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div id="transaction_inputs">
            <div className="added-assets-div">
              <label className="text-gray-700 block" htmlFor="addedAssets">
                What is the value of this transaction? ($ U.S.):
              </label>
              <input
                className={`input sm:text-sm sm:w-64 md:text-base md:w-96  ${
                  formErrors.value ? "input-error" : ""
                } ${flashErrors.value ? "animate-blink-error" : ""}`}
                id="added_assets"
                type="text"
                name="addedAssets"
                placeholder="0.00"
                value={conversion.convertNewValue}
                required
                readOnly
              />
              {formErrors.value && (
                <div className="error-message">
                  <p className="text-sm text-red-700 font-bold">
                    {formErrors.value}
                  </p>
                </div>
              )}
            </div>
            <div className="keyPad-div p-2">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.value}
              />
            </div>
            <div id="edit-user-radio-buttons" className="p-2">
              <fieldset className="edit-user-choices">
                <legend className="font-bold">
                  Does this transaction add to or subtract from your total
                  savings?
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
                    <label htmlFor="add">Add to Savings</label>
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
                    <label htmlFor="remove">Subtract from Savings</label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <div>
          <p>
            <small>
              <span className="text-red-600">WARNING:</span> Once you submit
              this transaction data, you will not be able to change or delete
              any of it after the fact.
            </small>
          </p>
          <p>
            <small>
              So make sure all of the above information is correct before
              clicking "Add this Transaction"
            </small>
          </p>
          <div className="button-div flex justify-between">
            <div>
              <button className="cancel-button" onClick={(e) => hideForm(e)}>
                Cancel
              </button>
            </div>
            <div>
              <button className="add-asset-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                Add this Transaction
              </button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  ) : null;
};

export default AddTransactionForm;
