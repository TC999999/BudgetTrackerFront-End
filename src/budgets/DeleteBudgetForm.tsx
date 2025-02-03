import { useState } from "react";
import {
  BudgetInterface,
  DeleteBudgetInterface,
} from "../interfaces/budgetInterfaces";
import { getRemainingMoney } from "../helpers/getRemainingMoney";

interface Props {
  hideDeleteForm: any;
  budget: BudgetInterface;
}

const DeleteBudgetForm: React.FC<Props> = (props) => {
  let expenseIDs = props.budget.expenses.map((v) => {
    return v._id;
  });
  let remainingMoney: string = getRemainingMoney(
    props.budget.moneyAllocated,
    +props.budget.moneySpent
  );
  let deleteBudgetData: DeleteBudgetInterface = {
    budgetID: props.budget._id,
    expenses: expenseIDs,
    addBackToAssets: +props.budget.moneyAllocated,
  };
  const [formData, setFormData] = useState(deleteBudgetData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: +value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log(formData);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="delete-budget-form">
      <h3>Before You Delete,</h3>
      <form onSubmit={handleSubmit}>
        <fieldset className="delete-choices">
          <legend>
            Are you returning the entire funds allocated or only the remaining
            funds?
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
        <button onClick={props.hideDeleteForm}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteBudgetForm;
