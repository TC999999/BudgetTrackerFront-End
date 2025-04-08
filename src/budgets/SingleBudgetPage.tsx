import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../features/hooks";
import BudgetPageCard from "./BudgetPageCard";
import ExpenseForm from "../expenses/ExpenseForm";
import ExpenseList from "../expenses/ExpenseList";
import DeleteBudgetForm from "./DeleteBudgetForm";
import EditBudgetForm from "./EditBudgetForm";
import OnPageLoading from "../OnPageLoading";
import { BudgetInterface, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import { setSmallLoading, setTokenError } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import BudgetAPI from "../apis/BudgetAPI";

type FormStateInterface = {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
};

// returns page for a single user's budget based on budget id ("/budgets/:id")
const SingleBudgetPage = (): JSX.Element => {
  const { budgetID, id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const notify = () =>
    toast.error("You have used all of the allocated funds for this budget");
  const [currentBudget, setCurrentBudget] = useState<BudgetInterface>({
    _id: "",
    title: "",
    moneySpent: 0,
    moneyAllocated: "",
  });

  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  // retrieves budget from db based on id string in url parameters upon initial render
  useEffect(() => {
    const getBudget = async () => {
      try {
        dispatch(setSmallLoading(true));
        if (budgetID && id) {
          let { budget, expenses } = await BudgetAPI.getUserBudget(
            budgetID,
            id
          );
          if (budget) {
            setCurrentBudget(budget);
            setExpenses(expenses);
          } else {
            dispatch(setSmallLoading(false));
            navigate("/budgets/error/unauthorized");
          }
        }
      } catch (err: any) {
        dispatch(setTokenError(err.message));
      } finally {
        dispatch(setSmallLoading(false));
      }
    };
    getBudget();
  }, []);

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
      currentBudget &&
      +currentBudget.moneyAllocated === +currentBudget.moneySpent
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

  // updates a budget's state with partial update data
  const updateBudget = useCallback(
    (updatedBudget: BudgetUpdate): void => {
      setCurrentBudget((prevBudget) => ({ ...prevBudget, ...updatedBudget }));
    },
    [currentBudget]
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
    (id: string): void => {
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => {
          return expense._id !== id;
        })
      );
    },
    [expenses]
  );

  return currentBudget._id ? (
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
                +currentBudget.moneyAllocated === +currentBudget.moneySpent
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
        <BudgetPageCard budget={currentBudget} />
        {formsState.showEditForm && (
          <EditBudgetForm
            hideEditForm={changeFormState}
            budget={currentBudget}
            updateBudget={updateBudget}
          />
        )}
        {formsState.showDeleteForm && (
          <DeleteBudgetForm
            hideDeleteForm={changeFormState}
            budget={currentBudget}
          />
        )}
        {formsState.showExpenseForm && (
          <ExpenseForm
            hideExpenseForm={changeFormState}
            budget={currentBudget}
            addExpense={addExpense}
            updateBudget={updateBudget}
          />
        )}
        <section className="expense-list">
          <h1 className="expense-list-title text-center text-2xl sm:text-3xl lg:text-4xl underline text-emerald-600 mb-2 font-bold duration-150">
            Expenses Made
          </h1>
          <ExpenseList
            expensesList={expenses}
            isFrontPage={false}
            budgetID={budgetID || null}
            filterExpense={filterExpense}
            updateBudget={updateBudget}
          />
        </section>
      </main>
    </div>
  ) : (
    <OnPageLoading loadingMsg="Budget" />
  );
};

export default SingleBudgetPage;
