import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, NavigateFunction } from "react-router-dom";
import { useAppDispatch } from "../../features/hooks";
import { AppDispatch } from "../../features/store";
import { setLoadError, setPageLoading } from "../../features/slices/loadSlice";
import { makeBudgetList } from "../../helpers/makeBudgetList";
import {
  BudgetInterface,
  BudgetListInterface,
} from "../../interfaces/budgetInterfaces";
import { toast, Id } from "react-toastify";
import BudgetAPI from "../../apis/BudgetAPI";

type input = string | undefined;

// custom hooks for the page containing a list of all of a user's budgets: includes retrieval of budgets on render,
// adding new budgets to the list after a form submission, and showing and hiding the form for new budget
const useBudgetPage = (id: input) => {
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (): Id =>
    toast.error("You have reached the maximum number of allowed budgets");

  const [budgets, setBudgets] = useState<BudgetInterface[]>([]);

  // creates list of budgets that changes based on state (calculates money remaining
  // from allocated budget funds as well)
  const budgetList: BudgetListInterface[] = useMemo<BudgetListInterface[]>(
    () => makeBudgetList(budgets),
    [budgets]
  );
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);

  // retrieves a list of budgets for a specific user on initial render
  useEffect((): void => {
    const getBudgets = async () => {
      try {
        dispatch(setPageLoading(true));
        if (id) {
          const budgets = await BudgetAPI.getAllBudgets(id);
          setBudgets(budgets);
        }
      } catch (err: any) {
        dispatch(setLoadError(JSON.parse(err.message)));
        navigate("/error");
      } finally {
        dispatch(setPageLoading(false));
      }
    };
    getBudgets();
  }, []);

  // adds a new budget to the state after a form submission
  const addBudget = useCallback(
    (newBudget: BudgetInterface): void => {
      setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
    },
    [budgets]
  );

  // updates state to show form for adding a new budget,
  // unless the user's current budget list is equal to 10
  const showForm = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void => {
      e.preventDefault();
      if (budgetList.length < 10) {
        setShowBudgetForm(true);
      } else {
        notify();
      }
    },
    [showBudgetForm]
  );

  // updates the state to hide form for adding a new budget
  const hideForm = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent
    ): void => {
      e.preventDefault();
      setShowBudgetForm(false);
    },
    [showBudgetForm]
  );

  return { budgetList, showBudgetForm, addBudget, showForm, hideForm };
};

export default useBudgetPage;
