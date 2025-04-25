import KeyPad from "../KeyPad";
import {
  newBudgetInterface,
  BudgetFormErrors,
  BudgetFlashErrors,
} from "../interfaces/budgetInterfaces";

type Props = {
  formData: newBudgetInterface;
  formErrors: BudgetFormErrors;
  flashErrors: BudgetFlashErrors;
  availableFunds: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handlePress: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  hideForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
  ) => void;
};

// returns form for creating a new budget
const BudgetForm: React.FC<Props> = ({
  formData,
  formErrors,
  flashErrors,
  availableFunds,
  handleChange,
  handleSubmit,
  handlePress,
  handleDelete,
  hideForm,
}): JSX.Element => {
  return (
    <div tabIndex={-1} id="budget-form-div" className="modal-layer-1">
      <div className="modal-layer-2">
        <div id="new-budget-form" className="modal-layer-3">
          <header className="text-center">
            <h1 className="text-3xl text-green-800 font-bold underline">
              Add a New Budget
            </h1>
            <h2 className="text-2xl mx-2">Available Funds:</h2>
            <h2 className="text-5xl font-bold text-green-700">
              ${(availableFunds / 100).toFixed(2)}
            </h2>
          </header>
          <form onSubmit={handleSubmit}>
            <div id="title-div" className="text-center mb-2">
              <label className="text-gray-700 block" htmlFor="title">
                Budget Title:
              </label>
              <input
                className={`input ${
                  formErrors.title ? "input-error" : "input-valid"
                } ${flashErrors.title ? "animate-blinkError" : ""}`}
                id="budget_title"
                type="text"
                name="title"
                placeholder="What's this budget for?"
                value={formData.title}
                onChange={handleChange}
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
                  Your budget title may only include letters, numbers, and
                  spaces.
                </small>
                <small> Spaces may only be between characters.</small>
              </div>
            </div>
            <div id="allocated-funds-div" className="text-center mb-2">
              <label className="text-gray-700 block" htmlFor="moneyAllocated">
                Money Allocated ($ U.S.):
              </label>
              <input
                className={`input ${
                  formErrors.moneyAllocated ? "input-error" : ""
                } } ${flashErrors.moneyAllocated ? "animate-blinkError" : ""}`}
                id="budget_allocation"
                type="text"
                name="moneyAllocated"
                placeholder="0.00"
                value={`$${(formData.moneyAllocated / 100).toFixed(2)}`}
                onChange={handleChange}
                required
                readOnly
              />
              <div>
                {formErrors.moneyAllocated && (
                  <div>
                    <p className="text-red-700 font-bold">
                      {formErrors.moneyAllocated}
                    </p>
                  </div>
                )}
                <small>
                  Make sure the funds for this budget does not exceed your
                  current available assets
                </small>
              </div>
            </div>
            <div id="keyPad-div">
              <KeyPad
                handlePress={handlePress}
                handleDelete={handleDelete}
                num={formData.moneyAllocated}
              />
            </div>
            <div id="button" className="flex justify-between m-2">
              <button className="cancel-button" onClick={(e) => hideForm(e)}>
                Cancel
              </button>
              <button id="add-budget-button" className="submit-button">
                Add this Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetForm;
