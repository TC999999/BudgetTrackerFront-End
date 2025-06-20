import { BudgetInterface, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import useEditBudget from "./hooks/useEditBudgets";
import KeyPad from "../KeyPad";
import { useMemo } from "react";
import { dollarConverter } from "../helpers/currencyConverter";
import Modal from "../motionWrappers/Modal";

type Props = {
  budget: BudgetInterface;
  hideEditForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showEditForm"
  ) => void;
  updateBudget: (updatedBudget: BudgetUpdate) => void;
  show: boolean;
  mockSubmit?: any;
};

type conversion = {
  convertNewTotalAssets: string;
  convertNewBudget: string;
  convertNewRemainingMoney: string;
  convertNewAddedMoney: string;
};

// shows a form for editing a single budget for a single user: the user can change the title or add or subtract a
// specified number of funds
const EditBudgetForm: React.FC<Props> = ({
  budget,
  updateBudget,
  hideEditForm,
  show,
  mockSubmit,
}): JSX.Element | null => {
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const {
    formData,
    formErrors,
    flashErrors,
    newRemainingMoney,
    newBudget,
    newTotalAssets,
    handlePress,
    handleDelete,
    handleRadio,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useEditBudget({
    budget,
    hideEditForm,
    updateBudget,
    mockSubmit,
  });

  const conversion: conversion = useMemo(() => {
    return {
      convertNewTotalAssets: dollarConverter(newTotalAssets),
      convertNewBudget: dollarConverter(newBudget),
      convertNewRemainingMoney: dollarConverter(newRemainingMoney),
      convertNewAddedMoney: dollarConverter(formData.addedMoney),
    };
  }, [newTotalAssets, newBudget, newRemainingMoney, formData.addedMoney]);

  return !formLoading ? (
    <Modal large={true} show={show}>
      <div
        id="edit-budget-form-div"
        role="form-modal"
        aria-label="edit-budget-form"
      >
        <header>
          <h2 className="text-3xl text-green-800 font-bold underline">
            Update {budget.title} Budget
          </h2>
        </header>
        <div className="info-and-form sm:flex sm:justify-center p-4">
          <div className="value-information sm:text-lg sm:m-2 sm:flex sm:items-center">
            <div className="sm:flex sm:flex-col justify-around sm:h-full w-full">
              <div className="sm:border-2 sm:p-4 sm:shadow-md">
                <h3 className="text-md sm:text-2xl sm:underline">
                  Your New Total Asset Value Will Be
                </h3>
                <p className="text-green-700 text-3xl sm:text-4xl font-bold">
                  {conversion.convertNewTotalAssets}
                </p>
              </div>
              <div className="sm:border-2 sm:p-4 sm:shadow-md">
                <h3 className="text-md sm:text-2xl sm:underline">
                  {budget.title} Budget Will Have a New Total Value of
                </h3>
                <p className="text-green-700 text-3xl sm:text-4xl  font-bold">
                  {conversion.convertNewBudget}
                </p>
              </div>
              <div className="sm:border-2 sm:p-4 sm:shadow-md">
                <h3 className="text-md sm:text-2xl sm:underline">
                  {budget.title} Budget Will Have a New Remaining Value of
                </h3>
                <p className="text-green-700 text-3xl sm:text-4xl  font-bold">
                  {conversion.convertNewRemainingMoney}
                </p>
              </div>
            </div>
          </div>
          <div className="edit-budget-form">
            <form onSubmit={handleSubmit}>
              <div className="title-div mb-2">
                <label className="text-gray-700 text-lg block" htmlFor="title">
                  Budget Title:{" "}
                  <input
                    className={`input ${
                      formErrors.title ? "input-error" : "input-valid"
                    } ${flashErrors.title && "animate-blink-error"}`}
                    id="title"
                    type="text"
                    name="title"
                    placeholder="What's this budget for?"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </label>
                {formErrors.title && (
                  <div>
                    <p className="text-lg text-red-700 font-bold">
                      {formErrors.title}
                    </p>
                  </div>
                )}

                <div className="flex flex-col">
                  <small>
                    Title length must be between 3 to 20 characters.
                  </small>
                  <small>Title may include any letters or numbers.</small>
                  <small>Spaces may only be between characters.</small>
                  <small>Allowed Special Characters: ("", '', -, :, /)</small>
                </div>
              </div>
              <div className="added-funds-div mb-2">
                <label
                  className="text-gray-700 text-lg block"
                  htmlFor="moneyAllocated"
                >
                  New Budget Funds($ U.S.):{" "}
                  <input
                    className={`input ${
                      formErrors.addedMoney ? "input-error" : ""
                    }`}
                    id="moneyAllocated"
                    type="text"
                    name="moneyAllocated"
                    placeholder="0.00"
                    value={conversion.convertNewAddedMoney}
                    readOnly
                  />
                </label>
                {formErrors.addedMoney && (
                  <div>
                    <p className="text-lg text-red-700 font-bold">
                      {formErrors.addedMoney}
                    </p>
                  </div>
                )}
                <div className="flex flex-col">
                  <small>
                    If adding to budget, make sure new assets are equal to or
                    less than your available assets.
                  </small>
                  <small>
                    If subtracting from budget, make sure new assets are equal
                    to or greater than your remaining budget value.
                  </small>
                </div>
              </div>
              <div className="keyPad-div">
                <KeyPad
                  handlePress={handlePress}
                  handleDelete={handleDelete}
                  num={formData.addedMoney}
                />
              </div>
              <div className="edit-budget-radio-buttons">
                <fieldset className="edit-budget-choices">
                  <legend className="font-bold">
                    Are you adding or subtracting this amount from the total
                    funds?
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
                      <label htmlFor="add">Add to Funds</label>
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
                      <label htmlFor="remove">Subtract from Funds</label>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div id="buttons" className="flex justify-between m-2">
                <button
                  className="cancel-button"
                  onClick={(e) => handleCancel(e)}
                >
                  Cancel
                </button>
                <button className="submit-button">Edit Budget</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  ) : null;
};

export default EditBudgetForm;
