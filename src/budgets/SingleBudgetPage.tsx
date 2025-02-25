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
      form: "showExpenseForm" | "showDeleteForm" | "showEditForm"
    ): void => {
      e.preventDefault();
      setFormsState((formState) => ({
        ...formState,
        [form]: !formsState[form],
      }));
    },
    [formsState]
  );

  return (
    <div className="budget-page">
      {budget ? (
        <div className="found-budget-page">
          <div className="buttons sticky top-0 bg-emerald-900 flex justify-around p-2 w-full">
            <div className="back-button-div">
              <button
                className="back-button budget-nav-button border-gray-300 bg-gray-400 hover:bg-gray-100 active:bg-gray-300"
                onClick={() => navigate("/budgets")}
              >
                Back to Budgets
              </button>
            </div>
            <div className="edit-budget-button-div">
              <button
                className="edit-budget-form-button budget-nav-button border-orange-300 text-white bg-orange-400 hover:bg-orange-200 hover:text-black active:bg-orange-300"
                onClick={(e) => changeFormState(e, "showEditForm")}
              >
                Update Budget
              </button>
            </div>
            <div className="delete-budget-button-div">
              <button
                className="delete-budget-form-button budget-nav-button border-red-500 bg-red-600 hover:bg-red-400 hover:text-white active:bg-red-100"
                onClick={(e) => changeFormState(e, "showDeleteForm")}
              >
                Delete Budget
              </button>
            </div>
            <div className="add-expense-button-div">
              <button
                className="add-expense-form-button budget-nav-button border-green-300 bg-green-500 hover:bg-green-400 hover:text-white active:bg-green-200"
                onClick={(e) => changeFormState(e, "showExpenseForm")}
              >
                Add Expense
              </button>
            </div>
          </div>
          <BudgetPageCard budget={budget} />
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
