import { useMemo } from "react";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { loading } from "../interfaces/loadingInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import useDeleteBudget from "./hooks/useDeleteBudget";
import { dollarConverter } from "../helpers/currencyConverter";
import Modal from "../motionWrappers/Modal";

type Props = {
  hideDeleteForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showDeleteForm"
  ) => void;
  budget: BudgetInterface;
  show: boolean;
  mockSubmit?: any;
};

// returns a form that allows the user to make a decision before deleting a budget
const DeleteBudgetForm: React.FC<Props> = ({
  hideDeleteForm,
  budget,
  show,
  mockSubmit,
}): JSX.Element | null => {
  const { formLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const {
    formData,
    newAssets,
    remainingMoney,
    handleChange,
    handleSubmit,
    handleCancel,
  } = useDeleteBudget({ budget, hideDeleteForm });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mockSubmit) {
      mockSubmit();
    } else {
      handleSubmit(e);
    }
  };

  const convertNewAssets = useMemo(() => {
    return dollarConverter(newAssets);
  }, [newAssets]);

  return !formLoading ? (
    <Modal large={false} show={show}>
      <div
        id="delete-budget-form"
        role="form-modal"
        aria-label="delete-budget-form"
      >
        <header className="transition duration-150">
          <h3 className="text-3xl sm:text-4xl font-bold text-red-700 underline">
            Before You Delete
          </h3>
          <h2 className="text-base sm:text-lg">
            Please be aware that deleting the{" "}
            <span className="font-bold">{budget.title}</span> budget will also
            delete all records of the expenses made using its funds.
          </h2>
        </header>
        <form onSubmit={onSubmit}>
          <fieldset id="delete-choices">
            <legend className="text-lg sm:text-xl font-bold duration-150">
              Are you returning any funds to your total savings?
            </legend>
            <div
              id="delete-budget-radio-buttons"
              className="text-lg border border-green-600 shadow-md"
            >
              <div
                id="add-no-funds"
                className={`p-3 border-b border-green-600 ${
                  formData.addBackToAssets === 0 ? "bg-gray-200" : ""
                }`}
              >
                <input
                  type="radio"
                  id="none"
                  name="addBackToAssets"
                  value={0}
                  className="form-radio radio radio-none"
                  onChange={handleChange}
                  checked={formData.addBackToAssets === 0}
                />
                <label htmlFor="none">
                  Return No Funds (
                  <span className="font-bold text-green-700">$0.00</span>)
                </label>
              </div>
              {remainingMoney !== budget.moneyAllocated && (
                <div
                  id="add-remaining-funds"
                  className={`p-3 border-b border-green-600 ${
                    formData.addBackToAssets === +remainingMoney
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="remaining"
                    name="addBackToAssets"
                    value={remainingMoney}
                    className="form-radio radio radio-remaining"
                    onChange={handleChange}
                    checked={formData.addBackToAssets === +remainingMoney}
                  />
                  <label htmlFor="remaining">
                    Return Remaining Funds Only (
                    <span className="font-bold text-green-700">
                      {dollarConverter(remainingMoney)}
                    </span>
                    )
                  </label>
                </div>
              )}
              <div
                id="add-all-funds "
                className={`p-3 ${
                  formData.addBackToAssets === +budget.moneyAllocated
                    ? "bg-green-100"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  id="all"
                  name="addBackToAssets"
                  value={budget.moneyAllocated}
                  className="form-radio radio radio-add"
                  onChange={handleChange}
                  checked={formData.addBackToAssets === +budget.moneyAllocated}
                />
                <label htmlFor="all">
                  Return All Funds (
                  <span className="font-bold text-green-700">
                    {dollarConverter(budget.moneyAllocated)}
                  </span>
                  )
                </label>
              </div>
            </div>
          </fieldset>
          <div id="new-assets">
            <p className="text-lg p-1">Your New Total Savings Will Be:</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-700 p-1 duration-150">
              {convertNewAssets}
            </p>
          </div>

          <div>
            <ul id="warning-list" className="list-disc list-inside">
              <small>
                <span className="text-red-600 font-bold">WARNING:</span> Once
                you click "Delete Budget", you not be able to:
              </small>
              <li>
                <small>
                  Retrieve any of the data created for this budget (including
                  expenses made).
                </small>
              </li>
              <li>
                <small>
                  Create any new data for this budget (including expenses).
                </small>
              </li>
              <li>
                <small>Recover any funds you forfeited deletion.</small>
              </li>
            </ul>

            <div id="buttons" className="flex justify-between m-2">
              <button
                className="cancel-button"
                onClick={(e) => handleCancel(e)}
              >
                Cancel
              </button>
              <button className="delete-button">Delete Budget</button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  ) : null;
};

export default DeleteBudgetForm;
