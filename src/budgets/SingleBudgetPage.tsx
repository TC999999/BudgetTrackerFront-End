import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "../features/hooks";
import { AppDispatch } from "../features/store";
import BudgetPageCard from "./BudgetPageCard";
import ExpenseForm from "../expenses/ExpenseForm";
import ExpenseList from "../expenses/ExpenseList";
import DeleteBudgetForm from "./DeleteBudgetForm";
import EditBudgetWindow from "./EditBudget";
import SingleBudgetButtons from "./SingleBudgetButtons";
import ListHeader from "../ListHeader";
import { addNewExpense } from "../helpers/addNewExpense";
import { BudgetInterface, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { ExpenseInterface } from "../interfaces/expenseInterfaces";
import { setLoadError, setPageLoading } from "../features/slices/loadSlice";
import { toast, Id } from "react-toastify";
import BudgetAPI from "../apis/BudgetAPI";
import ExpenseAPI from "../apis/ExpenseAPI";
import { getRemainingMoney } from "../helpers/getRemainingMoney";

type FormStateInterface = {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
};

// returns page for a single user's budget based on budget id ("/budgets/:id")
const SingleBudgetPage = (): JSX.Element => {
  const { budgetID, id } = useParams();
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const notify = (message: string): Id => toast.error(message);
  const [currentBudget, setCurrentBudget] = useState<BudgetInterface>({
    _id: "",
    title: "",
    moneySpent: 0,
    moneyAllocated: "",
  });

  const [expenses, setExpenses] = useState<ExpenseInterface[]>([]);

  // retrieves budget from db based on id string in url parameters upon initial render
  useEffect((): void => {
    const getBudget = async () => {
      try {
        dispatch(setPageLoading(true));
        if (budgetID && id) {
          let budget = await BudgetAPI.getUserBudget(budgetID, id);
          let expenses = await ExpenseAPI.getAllBudgetExpenses(budgetID, id);
          setCurrentBudget(budget);
          setExpenses(expenses);
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setPageLoading(false));
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
  const showFormState = useCallback(
    (
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
        notify("You have used all of the allocated funds for this budget");
      } else {
        setFormsState((formState) => ({
          ...formState,
          [form]: !formsState[form],
        }));
      }
    },
    [formsState, currentBudget]
  );

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
      setExpenses((expenses) => addNewExpense(expenses, [newExpense]));
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

  return (
    <div id="single-budget-page">
      <SingleBudgetButtons
        currentBudget={currentBudget}
        showFormState={showFormState}
      />
      <main>
        <BudgetPageCard budget={currentBudget} />
        {formsState.showEditForm && (
          <EditBudgetWindow
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
        <section id="budget-expense-list">
          <ListHeader type="Expenses" />
          <ExpenseList
            expensesList={expenses}
            isFrontPage={false}
            budgetID={budgetID}
            filterExpense={filterExpense}
            updateBudget={updateBudget}
            budgetFunds={{
              moneyRemaining: getRemainingMoney(
                currentBudget.moneyAllocated,
                currentBudget.moneySpent
              ),
              moneySpent: currentBudget.moneySpent,
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default SingleBudgetPage;
