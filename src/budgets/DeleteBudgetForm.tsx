import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BudgetInterface,
  DeleteBudgetInterface,
} from "../interfaces/budgetInterfaces";
import { useAppDispatch } from "../features/hooks";
import { deleteBudget } from "../features/actions/budgets";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import { makeExpenseIDList } from "../helpers/makeExpenseIDList";
import SmallLoadingMsg from "../SmallLoadingMsg";

interface Props {
  hideDeleteForm: any;
  budget: BudgetInterface;
}

const DeleteBudgetForm: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  let expenseIDs: string[] = useMemo<string[]>(
    () => makeExpenseIDList(props.budget.expenses),
    [props.budget.expenses]
  );
  let remainingMoney: string = getRemainingMoney(
    props.budget.moneyAllocated,
    +props.budget.moneySpent
  );
  let deleteBudgetData: DeleteBudgetInterface = {
    budgetID: props.budget._id,
    expenses: expenseIDs,
    addBackToAssets: +props.budget.moneyAllocated,
  };
  const [formData, setFormData] =
    useState<DeleteBudgetInterface>(deleteBudgetData);

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
  return (
    <div className="delete-budget-form-div">
      {isLoading ? (
        <SmallLoadingMsg />
      ) : (
        <div className="delete-budget-form">
          <h3>Before You Delete,</h3>
          <form onSubmit={handleSubmit}>
            <fieldset className="delete-choices">
              <legend>
                Are you returning the entire funds allocated or only the
                remaining funds?
              </legend>
              <div>
                <input
                  type="radio"
                  id="all"
                  name="addBackToAssets"
                  value={props.budget.moneyAllocated}
                  onChange={handleChange}
                  checked={
                    formData.addBackToAssets === +props.budget.moneyAllocated
                  }
                />
                <label htmlFor="all">
                  Return all funds (${props.budget.moneyAllocated})
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="remaining"
                  name="addBackToAssets"
                  value={remainingMoney}
                  onChange={handleChange}
                  checked={formData.addBackToAssets === +remainingMoney}
                />
                <label htmlFor="remaining">
                  Return remaining funds only (${remainingMoney})
                </label>
              </div>
            </fieldset>
            <div className="submit-button">
              <button>Delete Budget</button>
            </div>
          </form>
          <div className="cancel-delete-budget">
            <button onClick={(e) => props.hideDeleteForm(e, "showDeleteForm")}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteBudgetForm;
