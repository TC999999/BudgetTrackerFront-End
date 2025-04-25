import {
  BudgetInterface,
  BudgetEditInterface,
  UpdateBudgetFormErrors,
  UpdateBudgetFlashErrors,
} from "../interfaces/budgetInterfaces";
import KeyPad from "../KeyPad";

type Props = {
  formData: BudgetEditInterface;
  formErrors: UpdateBudgetFormErrors;
  flashErrors: UpdateBudgetFlashErrors;
  budget: BudgetInterface;
  newTotalAssets: string;
  newBudget: string;
  newRemainingMoney: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  handlePress: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleRadio: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hideEditForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showEditForm"
  ) => void;
};

const EditBudgetForm: React.FC<Props> = ({
  formData,
  formErrors,
  flashErrors,
  budget,
  newTotalAssets,
  newBudget,
  newRemainingMoney,
  handleChange,
  handleSubmit,
  handlePress,
  handleDelete,
  handleRadio,
  hideEditForm,
}): JSX.Element => {
  return (
    <div tabIndex={-1} className="modal-layer-1">
      <div className="modal-layer-2-lg">
        <div className="edit-budget-form-div text-center modal-layer-3">
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
                    ${newTotalAssets}
                  </p>
                </div>
                <div className="sm:border-2 sm:p-4 sm:shadow-md">
                  <h3 className="text-md sm:text-2xl sm:underline">
                    {budget.title} Budget Will Have a New Total Value of
                  </h3>
                  <p className="text-green-700 text-3xl sm:text-4xl  font-bold">
                    {newBudget}
                  </p>
                </div>
                <div className="sm:border-2 sm:p-4 sm:shadow-md">
                  <h3 className="text-md sm:text-2xl sm:underline">
                    {budget.title} Budget Will Have a New Remaining Value of
                  </h3>
                  <p className="text-green-700 text-3xl sm:text-4xl  font-bold">
                    {newRemainingMoney}
                  </p>
                </div>
              </div>
            </div>
            <div className="edit-budget-form">
              <form>
                <div className="title-div mb-2">
                  <label
                    className="text-gray-700 text-lg block"
                    htmlFor="title"
                  >
                    Budget Title:{" "}
                  </label>
                  <input
                    className={`input ${
                      formErrors.title ? "input-error" : "input-valid"
                    } ${flashErrors.title && "animate-blinkError"}`}
                    id="budget_title"
                    type="text"
                    name="title"
                    placeholder="What's this budget for?"
                    value={formData.title}
                    onChange={handleChange}
                  />
                  {formErrors.title && (
                    <div>
                      <p className="text-lg text-red-700 font-bold">
                        {formErrors.title}
                      </p>
                    </div>
                  )}

                  <small>
                    Make sure your title has between 20 to 3 characters
                  </small>
                </div>
                <div className="added-funds-div mb-2">
                  <label
                    className="text-gray-700 text-lg block"
                    htmlFor="moneyAllocated"
                  >
                    New Budget Funds($ U.S.):{" "}
                  </label>
                  <input
                    className={`input ${
                      formErrors.addedMoney ? "input-error" : ""
                    }`}
                    id="added_budget_allocation"
                    type="text"
                    name="moneyAllocated"
                    placeholder="0.00"
                    value={`$${(formData.addedMoney / 100).toFixed(2)}`}
                    readOnly
                  />
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
              </form>
            </div>
          </div>
          <div id="buttons" className="flex justify-between m-2">
            <button
              className="cancel-button"
              onClick={(e) => hideEditForm(e, "showEditForm")}
            >
              Cancel
            </button>
            <button onClick={(e) => handleSubmit(e)} className="submit-button">
              Edit Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetForm;
