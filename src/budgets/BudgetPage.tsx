import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useNavigate, NavigateFunction } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { useAppDispatch, useAppSelector } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { shallowEqual } from "react-redux";
import { setLoadError, setPageLoading } from "../features/slices/loadSlice";
import NewBudgetWindow from "./NewBudget";
import BudgetList from "./BudgetList";
import { makeBudgetList } from "../helpers/makeBudgetList";
import {
  BudgetInterface,
  BudgetListInterface,
} from "../interfaces/budgetInterfaces";
import { loading } from "../interfaces/loadingInterfaces";

import { toast, Id } from "react-toastify";
import BudgetAPI from "../apis/BudgetAPI";

// returns page for list of all budgets the user currently has
const BudgetPage = (): JSX.Element => {
  const { id } = useParams();
  const dispatch: AppDispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const notify = (): Id =>
    toast.error("You have reached the maximum number of allowed budgets");

  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const [budgets, setBudgets] = useState<BudgetInterface[]>([]);

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

  return (
    <div id="all-budget-page">
      <header id="additional-nav-header">
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
      <main>
        <header className="text-center">
          <div className="text-2xl sm:text-3xl text-emerald-500 font-bold">
            <h1 className=" underline">All Current Budgets</h1>
            <h2>
              {pageLoading ? (
                <Skeleton width={60} />
              ) : (
                `${budgetList.length}/10`
              )}
            </h2>
          </div>
          <small>
            Here you may set aside funds in order to make plans for future
            budgets or record current budgets you may have. You are allowed a
            maximum of ten budgets.
          </small>
        </header>

        {showBudgetForm && (
          <NewBudgetWindow hideForm={HideForm} addBudget={addBudget} />
        )}

        <BudgetList allBudgets={budgetList} />
      </main>
    </div>
  );
};

export default BudgetPage;
