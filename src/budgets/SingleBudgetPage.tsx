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
          <div className="buttons sticky top-0 bg-emerald-900 flex justify-around p-2 w-full">
            <div className="back-button-div">
              <button
                className="back-button border-2 border-gray-300 p-2 rounded-full bg-gray-400 hover:bg-gray-100 active:bg-gray-300 duration-150"
                onClick={() => navigate("/budgets")}
              >
                Back to All Budgets
              </button>
            </div>
            <div className="edit-budget-button-div">
              <button
                className="edit-budget-form-button border-2 border-orange-300 p-2 rounded-full text-white bg-orange-400 hover:bg-orange-200 hover:text-black active:bg-orange-300 duration-150"
                onClick={(e) => changeFormState(e, "showEditForm")}
              >
                Update Budget
              </button>
            </div>

            <div className="delete-budget-button-div">
              <button
                className="delete-budget-form-button border-2 border-red-500 p-2 rounded-full bg-red-600"
                onClick={(e) => changeFormState(e, "showDeleteForm")}
              >
                Delete this Budget
              </button>
            </div>

            <div className="add-expense-button-div">
              <button
                className="add-expense-form-button border-2 border-green-300 p-2 rounded-full bg-green-400"
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
