import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { getCurrentBudget } from "../helpers/getCurrentBudget";
import { UserContextInterface } from "../interfaces/userInterfaces";
import BudgetPageCard from "./BudgetPageCard";
import ExpenseForm from "../expenses/ExpenseForm";
import BudgetErrorPage from "./BudgetErrorPage";
import ExpenseList from "../expenses/ExpenseList";

const SingleBudgetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const budget = useMemo(
    () => getCurrentBudget(userStatus.user.budgets, id || ""),
    [userStatus.user.budgets]
  );
  const [showExpenseForm, setShowExpenseForm] = useState<boolean>(false);

  const HideForm = useCallback(() => {
    setShowExpenseForm(false);
  }, [showExpenseForm]);

  return (
    <div>
      {budget ? (
        <div className="budget-page">
          <button onClick={() => navigate(-1)}>Back to All Budgets</button>
          <BudgetPageCard budget={budget} />

          {showExpenseForm ? (
            <ExpenseForm hideForm={HideForm} budget={budget} />
          ) : (
            <button onClick={() => setShowExpenseForm(true)}>
              Add Expense
            </button>
          )}
          <ExpenseList expensesList={budget?.expenses} />
        </div>
      ) : (
        <BudgetErrorPage />
      )}
    </div>
  );
};

export default SingleBudgetPage;
