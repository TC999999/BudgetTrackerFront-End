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
import { toast } from "react-toastify";

type FormStateInterface = {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
};

const SingleBudgetPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = () =>
    toast.error("You have used all of the allocated funds for this budget");
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

  const showFormState = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm" | "showDeleteForm" | "showEditForm"
  ): void => {
    e.preventDefault();
    if (
      form === "showExpenseForm" &&
      formsState.showExpenseForm === false &&
      +budget.moneyAllocated === +budget.moneySpent
    ) {
      notify();
    } else {
      setFormsState((formState) => ({
        ...formState,
        [form]: !formsState[form],
      }));
    }
  };

  const changeFormState = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
      form: "showExpenseForm" | "showDeleteForm" | "showEditForm"
    ): void => {
      e.preventDefault();
      setFormsState((formState) => ({
        ...formState,
        [form]: false,
      }));
    },
    [formsState]
  );

  return budget ? (
    <div className="budget-page">
      <header>
        <nav className="buttons sticky top-0 bg-emerald-900 flex justify-around p-2 w-full">
          <button
            className="back-button budget-nav-button border-gray-300 bg-gray-400 hover:bg-gray-100 active:bg-gray-300"
            onClick={() => navigate("/budgets")}
          >
            Back to Budgets
          </button>
          <button
            className="edit-budget-form-button budget-nav-button border-orange-300 text-white bg-orange-400 hover:bg-orange-200 hover:text-black active:bg-orange-300"
            onClick={(e) => showFormState(e, "showEditForm")}
          >
            Update Budget
          </button>
          <button
            className="delete-budget-form-button budget-nav-button border-red-500 bg-red-600 hover:bg-red-400 hover:text-white active:bg-red-100"
            onClick={(e) => showFormState(e, "showDeleteForm")}
          >
            Delete Budget
          </button>
          <button
            className={`add-expense-form-button budget-nav-button border-green-300 bg-green-500
              ${
                +budget.moneyAllocated === +budget.moneySpent
                  ? "cursor-not-allowed"
                  : "hover:bg-green-400 hover:text-white active:bg-green-200"
              }`}
            onClick={(e) => showFormState(e, "showExpenseForm")}
          >
            Add Expense
          </button>
        </nav>
      </header>
      <main>
        <BudgetPageCard budget={budget} />
        {formsState.showEditForm && (
          <EditBudgetForm hideEditForm={changeFormState} budget={budget} />
        )}
        {formsState.showDeleteForm && (
          <DeleteBudgetForm hideDeleteForm={changeFormState} budget={budget} />
        )}
        {formsState.showExpenseForm && (
          <ExpenseForm hideExpenseForm={changeFormState} budget={budget} />
        )}
        <section className="expense-list">
          <h1 className="expense-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
            Expenses Made
          </h1>
          <ExpenseList
            expensesList={budget?.expenses}
            isFrontPage={false}
            budgetID={id || null}
          />
        </section>
      </main>
    </div>
  ) : (
    <BudgetErrorPage />
  );
};

export default SingleBudgetPage;
