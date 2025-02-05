import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { makeBudgetList } from "../helpers/makeBudgetList";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

const BudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const budgetList: BudgetListInterface[] = useMemo<BudgetListInterface[]>(
    () => makeBudgetList(userStatus.user.budgets),
    [userStatus.user.budgets]
  );
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);

  const HideForm = useCallback((): void => {
    setShowBudgetForm(false);
  }, [showBudgetForm]);

  return (
    <div className="budget-page">
      {" "}
      <button onClick={() => navigate("/")}>Back Home</button>
      {showBudgetForm ? (
        <BudgetForm hideForm={HideForm} />
      ) : (
        <div className="add-budget-form-button">
          <button onClick={() => setShowBudgetForm(true)}>
            Add a new Budget
          </button>
        </div>
      )}
      {userStatus.user.budgets.length ? (
        <BudgetList allBudgets={budgetList} />
      ) : (
        <p>no budgets yet</p>
      )}
    </div>
  );
};

export default BudgetPage;
