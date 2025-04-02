import { useState, useMemo, useCallback } from "react";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { makeBudgetList } from "../helpers/makeBudgetList";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";
import { toast } from "react-toastify";

// returns page for list of all budgets the user currently has
const BudgetPage = (): JSX.Element => {
  const notify = () =>
    toast.error("You have reached the maximum number of allowed budgets");
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );

  // creates list of budgets that changes based on redux state
  const budgetList: BudgetListInterface[] = useMemo<BudgetListInterface[]>(
    () => makeBudgetList(userStatus.user!.budgets),
    [userStatus.user!.budgets]
  );
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);

  // shows form for adding a new budget, unless the user's current budget list is equal to 10
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

  // hides form for adding a new budget
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

      {showBudgetForm && <BudgetForm hideForm={HideForm} />}
      <BudgetList allBudgets={budgetList} />
    </div>
  );
};

export default BudgetPage;
