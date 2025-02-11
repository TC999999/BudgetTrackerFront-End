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
import SmallLoadingMsg from "../SmallLoadingMsg";

type Props = {
  hideDeleteForm: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    form: string
  ) => void;
  budget: BudgetInterface;
};

const DeleteBudgetForm: React.FC<Props> = ({ hideDeleteForm, budget }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    setIsLoading(true);
    try {
      await dispatch(deleteBudget(formData)).unwrap();
      navigate("/budgets");
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };
  return isLoading ? (
    <SmallLoadingMsg />
  ) : (
    <div className="delete-budget-form-div modal-layer-1">
      <div className="modal-layer-2">
        <div className="delete-budget-form text-center modal-layer-3">
          <h3 className="text-3xl text-red-700">Before You Delete</h3>
          <div className="form-div">
            <form onSubmit={handleSubmit}>
              <fieldset className="delete-choices">
                <legend className="text-xl">
                  Are you returning any funds to your available assets?
                </legend>
                <div className="add-no-funds text-lg p-3">
                  <input
                    type="radio"
                    id="none"
                    name="addBackToAssets"
                    value={0}
                    onChange={handleChange}
                    checked={formData.addBackToAssets === 0}
                  />
                  <label htmlFor="none">Return No Funds ($0.00)</label>
                </div>
                {remainingMoney !== budget.moneyAllocated && (
                  <div className="add-remaining-funds text-lg p-3">
                    <input
                      type="radio"
                      id="remaining"
                      name="addBackToAssets"
                      value={remainingMoney}
                      onChange={handleChange}
                      checked={formData.addBackToAssets === +remainingMoney}
                    />
                    <label htmlFor="remaining">
                      Return Remaining Funds Only (${remainingMoney})
                    </label>
                  </div>
                )}
                <div className="add-all-funds text-lg p-3">
                  <input
                    type="radio"
                    id="all"
                    name="addBackToAssets"
                    value={budget.moneyAllocated}
                    onChange={handleChange}
                    checked={
                      formData.addBackToAssets === +budget.moneyAllocated
                    }
                  />
                  <label htmlFor="all">
                    Return All Funds (${budget.moneyAllocated})
                  </label>
                </div>
              </fieldset>

              <div className="new-assets text-green-600">
                <p className="text-lg">Your New Available Assets Will Be</p>
                <p className="text-2xl">${newAssets}</p>
              </div>
              <div className="buttons flex justify-between m-2">
                <div className="delete-button-div">
                  <button className="delete-button bg-green-300 border-2 border-emerald-900 rounded-full px-2 py-2 hover:bg-green-900 hover:text-gray-100 active:bg-gray-100 active:text-emerald-900">
                    Delete Budget
                  </button>
                </div>
                <div className="cancel-delete-budget">
                  <button
                    className="cancel-button"
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
    </div>
  );
};

export default DeleteBudgetForm;
