import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { getCurrentBudget } from "../helpers/getCurrentBudget";
import { UserContextInterface } from "../interfaces/userInterfaces";
import BudgetPageCard from "./BudgetPageCard";
import ExpenseForm from "../expenses/ExpenseForm";
import BudgetErrorPage from "./BudgetErrorPage";
import ExpenseList from "../expenses/ExpenseList";
import DeleteBudgetForm from "./DeleteBudgetForm";
import EditBudgetForm from "./EditBudgetForm";
import { BudgetInterface } from "../interfaces/budgetInterfaces";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import ExpenseAPI from "../apis/ExpenseAPI";
import { setSmallLoading, setTokenError } from "../features/auth/authSlice";
import { toast } from "react-toastify";

type FormStateInterface = {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
};

// returns page for a single user's budget based on budget id ("/budgets/:id")
const SingleBudgetPage = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const notify = () =>
    toast.error("You have used all of the allocated funds for this budget");
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  useEffect(() => {
    const getExpenses = async () => {
      try {
        dispatch(setSmallLoading(true));
        if (id) {
          let expenses = await ExpenseAPI.getAllBudgetExpenses(id);
          setExpenses(expenses);
        }
      } catch (err: any) {
        dispatch(setTokenError(err.message));
      } finally {
        dispatch(setSmallLoading(false));
      }
    };
    getExpenses();
  }, [id]);

  // retrieves budget from user budget list based on id string in url parameters
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

  // sets state for which form should be shown. Will not show expense form if total budget funds and money
  // spent with budget funds are equal
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

  // callback function to hide forms when cancelling or after submission
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

  // adds a new expense to the budget state after successfully adding it to the db
  const addExpense = useCallback(
    (newExpense: ExpenseInterface): void => {
      setExpenses((expenses) => [newExpense, ...expenses]);
    },
    [expenses]
  );

  // removes an expense from the budget state after successfully removing it
  // from the db
  const filterExpense = useCallback(
    (delExpense: ExpenseInterface): void => {
      let newExpenses = expenses.filter((expense) => {
        return expense._id !== delExpense._id;
      });
      setExpenses(newExpenses);
    },
    [expenses]
  );

  return budget ? (
    <div id="budget-page">
      <header className="additional-nav-header">
        <nav className="buttons flex justify-around w-full">
          <button
            id="edit-budget-form-button"
            className="nav-button border-orange-300 text-white bg-orange-400 hover:bg-orange-200 hover:text-black active:bg-orange-300"
            onClick={(e) => showFormState(e, "showEditForm")}
          >
            Update Budget
          </button>
          <button
            id="delete-budget-form-button"
            className="nav-button border-red-500 bg-red-600 hover:bg-red-400 hover:text-white active:bg-red-100"
            onClick={(e) => showFormState(e, "showDeleteForm")}
          >
            Delete Budget
          </button>
          <button
            id="add-expense-form-button"
            className={`nav-button border-green-300 bg-green-500
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
          <ExpenseForm
            hideExpenseForm={changeFormState}
            budget={budget}
            addExpense={addExpense}
          />
        )}
        <section className="expense-list">
          <h1 className="expense-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
            Expenses Made
          </h1>
          <ExpenseList
            expensesList={expenses}
            isFrontPage={false}
            budgetID={id || null}
            filterExpense={filterExpense}
          />
        </section>
      </main>
    </div>
  ) : (
    <BudgetErrorPage />
  );
};

export default SingleBudgetPage;
