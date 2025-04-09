import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch } from "../features/hooks";
import { setSmallLoading, setTokenError } from "../features/auth/authSlice";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";
import OnPageLoading from "../OnPageLoading";
import { makeBudgetList } from "../helpers/makeBudgetList";
import {
  BudgetInterface,
  BudgetListInterface,
} from "../interfaces/budgetInterfaces";
import { toast } from "react-toastify";
import BudgetAPI from "../apis/BudgetAPI";

// returns page for list of all budgets the user currently has
const BudgetPage = (): JSX.Element => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const notify = () =>
    toast.error("You have reached the maximum number of allowed budgets");

  const [budgets, setBudgets] = useState<BudgetInterface[]>([]);

  // retrieves a list of budgets for a specific user on initial render
  useEffect(() => {
    const getBudgets = async () => {
      try {
        dispatch(setSmallLoading(true));
        if (id) {
          const budgets = await BudgetAPI.getAllBudgets(id);
          setBudgets(budgets);
        }
      } catch (err: any) {
        dispatch(setTokenError(err.message));
      } finally {
        dispatch(setSmallLoading(false));
      }
    };
    getBudgets();
  }, []);

  // creates list of budgets that changes based on state (calculates money remaining
  // from allocated budget funds as well)
  const budgetList: BudgetListInterface[] = useMemo<BudgetListInterface[]>(
    () => makeBudgetList(budgets),
    [budgets]
  );
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);

  // adds a new budget to the state after a form submission
  const addBudget = useCallback(
    (newBudget: BudgetInterface): void => {
      setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    },
    [budgets]
  );

  // updates state to show form for adding a new budget,
  // unless the user's current budget list is equal to 10
  const showForm = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    e.preventDefault();
    if (budgetList.length < 10) {
      setShowBudgetForm(true);
    } else {
      notify();
    }
  };

  // updates the state to hide form for adding a new budget
  const HideForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowBudgetForm(false);
    },
    [showBudgetForm]
  );

  return budgetList.length ? (
    <div className="budget-page">
      <header className="additional-nav-header">
        <nav className="buttons flex justify-around w-full">
          <button
            id="show-budget-form-button"
            className={`nav-button border-green-500 bg-green-300 ${
              budgetList.length < 10
                ? "hover:bg-green-500 hover:text-white active:bg-green-200"
                : "cursor-not-allowed"
            }`}
            onClick={(e) => showForm(e)}
          >
            Add a new Budget
          </button>
        </nav>
      </header>

      {showBudgetForm && (
        <BudgetForm hideForm={HideForm} addBudget={addBudget} />
      )}
      <BudgetList allBudgets={budgetList} />
    </div>
  ) : (
    <OnPageLoading loadingMsg="Budgets" />
  );
};

export default BudgetPage;
