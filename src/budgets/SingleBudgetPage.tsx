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
import { BudgetInterface } from "../interfaces/budgetInterfaces";

type FormStateInterface = {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
  [key: string]: boolean;
};

const SingleBudgetPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const budget: BudgetInterface = useMemo<BudgetInterface>(
    () => getCurrentBudget(userStatus.user!.budgets, id || ""),
    [userStatus.user!.budgets]
  );
  const initialFormState: FormStateInterface = {
    showExpenseForm: false,
    showDeleteForm: false,
    showEditForm: false,
  };
  const [formsState, setFormsState] =
    useState<FormStateInterface>(initialFormState);

  const changeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
      form: string
    ): void => {
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

          <div className="flex justify-around p-2">
            <div className="edit-budget-form-button border-2 border-orange-300 p-2 rounded-full bg-orange-400">
              <button onClick={(e) => changeFormState(e, "showEditForm")}>
                Update Budget
              </button>
            </div>

            <div className="delete-budget-form-button border-2 border-red-500 p-2 rounded-full bg-red-600">
              <button onClick={(e) => changeFormState(e, "showDeleteForm")}>
                Delete this Budget
              </button>
            </div>

            <div className="add-expense-form-button border-2 border-green-300 p-2 rounded-full bg-green-400">
              <button onClick={(e) => changeFormState(e, "showExpenseForm")}>
                Add Expense
              </button>
            </div>
          </div>

          {formsState.showEditForm && (
            <EditBudgetForm hideEditForm={changeFormState} budget={budget} />
          )}

          {formsState.showDeleteForm && (
            <DeleteBudgetForm
              hideDeleteForm={changeFormState}
              budget={budget}
            />
          )}

          {formsState.showExpenseForm && (
            <ExpenseForm hideExpenseForm={changeFormState} budget={budget} />
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
