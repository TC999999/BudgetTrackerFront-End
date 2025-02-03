import { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../features/hooks";
import { getCurrentBudget } from "../helpers/getCurrentBudget";
import { UserContextInterface } from "../interfaces/userInterfaces";
import BudgetPageCard from "./BudgetPageCard";
import ExpenseForm from "../expenses/ExpenseForm";
import BudgetErrorPage from "./BudgetErrorPage";
import ExpenseList from "../expenses/ExpenseList";
import DeleteBudgetForm from "./DeleteBudgetForm";

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
  const [showDeleteBudgetForm, setShowDeleteBudgetForm] =
    useState<boolean>(false);

  const HideForm = useCallback(() => {
    setShowExpenseForm(false);
  }, [showExpenseForm]);

  const HideDeleteForm = useCallback(() => {
    setShowDeleteBudgetForm(false);
  }, [showDeleteBudgetForm]);

  return (
    <div className="budget-page">
      {budget ? (
        <div className="found-budget-page">
          <button onClick={() => navigate("/budgets")}>
            Back to All Budgets
          </button>
          <BudgetPageCard budget={budget} />
          {showDeleteBudgetForm ? (
            <DeleteBudgetForm hideDeleteForm={HideDeleteForm} budget={budget} />
          ) : (
            <div className="delete-budget-form">
              <button onClick={() => setShowDeleteBudgetForm(true)}>
                Delete this Budget
              </button>
            </div>
          )}
          {showExpenseForm ? (
            <ExpenseForm hideForm={HideForm} budget={budget} />
          ) : (
            <div className="add-expense-form">
              <button onClick={() => setShowExpenseForm(true)}>
                Add Expense
              </button>
            </div>
          )}
          <ExpenseList
            expensesList={budget?.expenses}
            isFrontPage={false}
            budgetID={id || null}
          />
        </div>
      ) : (
        <BudgetErrorPage />
      )}
    </div>
  );
};

export default SingleBudgetPage;
