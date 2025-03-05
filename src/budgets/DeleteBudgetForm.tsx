import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BudgetInterface,
  DeleteBudgetInterface,
} from "../interfaces/budgetInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { deleteBudget } from "../features/actions/budgets";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { makeExpenseIDList } from "../helpers/makeExpenseIDList";
import { calculateNewTotalAssetsWithoutOperation } from "../helpers/calculateNewTotalAssets";

type Props = {
  hideDeleteForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    form: "showDeleteForm"
  ) => void;
  budget: BudgetInterface;
};

const DeleteBudgetForm: React.FC<Props> = ({ hideDeleteForm, budget }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  let remainingMoney: string = getRemainingMoney(
    budget.moneyAllocated,
    +budget.moneySpent
  );
  let deleteBudgetData: DeleteBudgetInterface = {
    budgetID: budget._id,
    expenses: makeExpenseIDList(budget.expenses),
    addBackToAssets: 0,
  };
  const [formData, setFormData] =
    useState<DeleteBudgetInterface>(deleteBudgetData);

  let newAssets: string = useMemo<string>(
    () =>
      calculateNewTotalAssetsWithoutOperation(
        userStatus.user!.totalAssets,
        formData.addBackToAssets
      ),
    [formData.addBackToAssets]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: +value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      await dispatch(deleteBudget(formData)).unwrap();
      navigate("/budgets");
    } catch (err) {
      console.log(err);
    }
  };
  return !userStatus.smallLoading ? (
    <div className="delete-budget-form-div modal-layer-1">
      <div className="modal-layer-2">
        <div className="delete-budget-form text-center modal-layer-3">
          <section className="messages">
            <header className="text-3xl sm:text-4xl font-bold text-red-700 underline duration-150">
              <h3>Before You Delete</h3>
            </header>

            <p className="text-base sm:text-lg duration-150">
              Please be aware that deleting the {budget.title} budget will also
              delete every transaction ({budget.expenses.length} transaction(s))
              made using its funds
            </p>
          </section>

          <form onSubmit={handleSubmit}>
            <fieldset className="delete-choices">
              <legend className="text-lg sm:text-xl font-bold duration-150">
                Are you returning any funds to your available assets?
              </legend>
              <div className="delete-budget-radio-buttons text-lg border border-green-600 shadow-md">
                <div
                  className={`add-no-funds p-3 border-b border-green-600 ${
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
                    className={`add-remaining-funds p-3 border-b border-green-600 ${
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
                  className={`add-all-funds p-3 ${
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

            <div className="new-assets">
              <p className="text-lg p-1">Your New Available Assets Will Be:</p>
              <p className="text-3xl sm:text-4xl font-bold text-green-700 p-1 duration-150">
                ${newAssets}
              </p>
            </div>
            <div className="buttons flex justify-between m-2">
              <div className="delete-button-div">
                <button className="delete-button duration-150 bg-red-300 border-2 border-red-900 rounded-full px-2 py-2 hover:bg-red-800 hover:text-white active:bg-red-100 active:text-red-900">
                  Delete Budget
                </button>
              </div>
              <div className="cancel-delete-budget">
                <button
                  className="cancel-button duration-150"
                  onClick={(e) => hideDeleteForm(e, "showDeleteForm")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : null;
};

export default DeleteBudgetForm;
