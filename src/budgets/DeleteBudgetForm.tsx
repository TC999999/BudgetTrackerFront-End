import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BudgetInterface,
  DeleteBudgetInterface,
} from "../interfaces/budgetInterfaces";
import { error } from "../interfaces/miscTypes";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { setSmallLoading, setTotalAssets } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { calculateNewTotalAssetsWithoutOperation } from "../helpers/calculateNewTotalAssets";
import { toast } from "react-toastify";
import BudgetAPI from "../apis/BudgetAPI";

type Props = {
  hideDeleteForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    form: "showDeleteForm"
  ) => void;
  budget: BudgetInterface;
};

// returns a form that allows the user to make a decision before deleting a budget
const DeleteBudgetForm: React.FC<Props> = ({
  hideDeleteForm,
  budget,
}): JSX.Element | null => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = (title: string, addBackToAssets: number) =>
    toast.success(
      `${title} budget deleted successfully! $${addBackToAssets.toFixed(
        2
      )} added to available assets.`
    );
  const notifyError = (error: error) =>
    toast.error(`${error.status} Error: ${error.message}`);

  const { user, smallLoading }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  // constant used if user chooses to return the remaining funds of the budget only
  let remainingMoney: string = getRemainingMoney(
    budget.moneyAllocated,
    +budget.moneySpent
  );
  // initial form data for deleting a budget, the first two remain constant while the last one changes
  // based on which radio button the user selects
  let deleteBudgetData: DeleteBudgetInterface = {
    user: user!._id,
    budgetID: budget._id,
    addBackToAssets: 0,
  };

  // sets state for data to be submitting to backend that will be used to update db
  const [formData, setFormData] =
    useState<DeleteBudgetInterface>(deleteBudgetData);

  // calculates what the user's new total asset value will be before submitting the form
  let newAssets: string = useMemo<string>(
    () =>
      calculateNewTotalAssetsWithoutOperation(
        user!.totalAssets,
        formData.addBackToAssets
      ),
    [formData.addBackToAssets]
  );

  // updates form data based on which radio button the user has selected
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: +value }));
  };

  // sends data to backend to delete budget and all expenses made using its funds and navigate back to
  // the budget list page
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      dispatch(setSmallLoading(true));
      let { totalAssets } = await BudgetAPI.deleteBudget(formData);
      dispatch(setTotalAssets(totalAssets));
      navigate(`/budgets/user/${user?._id}`);
      notify(budget.title, formData.addBackToAssets);
    } catch (err: any) {
      notifyError(JSON.parse(err.message));
    } finally {
      dispatch(setSmallLoading(false));
    }
  };

  return !smallLoading ? (
    <div id="delete-budget-form-div" className="modal-layer-1">
      <div className="modal-layer-2">
        <div id="delete-budget-form" className=" text-center modal-layer-3">
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
          <form onSubmit={handleSubmit}>
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
                        ${remainingMoney}
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
                    checked={
                      formData.addBackToAssets === +budget.moneyAllocated
                    }
                  />
                  <label htmlFor="all">
                    Return All Funds (
                    <span className="font-bold text-green-700">
                      ${budget.moneyAllocated}
                    </span>
                    )
                  </label>
                </div>
              </div>
            </fieldset>
            <div id="new-assets">
              <p className="text-lg p-1">Your New Total Savings Will Be:</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-700 p-1 duration-150">
                ${newAssets}
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
                  onClick={(e) => hideDeleteForm(e, "showDeleteForm")}
                >
                  Cancel
                </button>
                <button className="delete-button">Delete Budget</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default DeleteBudgetForm;
