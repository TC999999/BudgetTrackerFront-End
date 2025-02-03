import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { makeBudgetList } from "../helpers/makeBudgetList";

const BudgetPage = () => {
  const navigate = useNavigate();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const budgetList = useMemo(
    () => makeBudgetList(userStatus.user.budgets),
    [userStatus.user.budgets]
  );
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);

  const HideForm = useCallback(() => {
    setShowBudgetForm(false);
  }, [showBudgetForm]);

  return (
    <div className="budget-page">
      {" "}
      <button onClick={() => navigate("/")}>Back Home</button>
      <h1>BudgetPage</h1>
      {showBudgetForm ? (
        <BudgetForm hideForm={HideForm} />
      ) : (
        <button onClick={() => setShowBudgetForm(true)}>
          Add a new Budget
        </button>
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
