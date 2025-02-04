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
import EditBudgetForm from "./EditBudgetForm";

interface FormStateInterface {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
  [key: string]: boolean;
}

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
  const initialFormState: FormStateInterface = {
    showExpenseForm: false,
    showDeleteForm: false,
    showEditForm: false,
  };
  const [formsState, setFormsState] =
    useState<FormStateInterface>(initialFormState);

  const changeFormState = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, form: string) => {
      e.preventDefault();
      setFormsState(() => ({ ...initialFormState, [form]: !formsState[form] }));
    },
    [formsState]
  );

  return (
    <div className="budget-page">
      {budget ? (
        <div className="found-budget-page">
          <button onClick={() => navigate("/budgets")}>
            Back to All Budgets
          </button>
          <BudgetPageCard budget={budget} />
          {formsState.showEditForm ? (
            <EditBudgetForm hideEditForm={changeFormState} budget={budget} />
          ) : (
            <div className="Edit-budget-form-button">
              <button onClick={(e) => changeFormState(e, "showEditForm")}>
                Edit Budget
              </button>
            </div>
          )}
          {formsState.showDeleteForm ? (
            <DeleteBudgetForm
              hideDeleteForm={changeFormState}
              budget={budget}
            />
          ) : (
            <div className="delete-budget-form-button">
              <button onClick={(e) => changeFormState(e, "showDeleteForm")}>
                Delete this Budget
              </button>
            </div>
          )}
          {formsState.showExpenseForm ? (
            <ExpenseForm hideForm={changeFormState} budget={budget} />
          ) : (
            <div className="add-expense-form-button">
              <button onClick={(e) => changeFormState(e, "showExpenseForm")}>
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
