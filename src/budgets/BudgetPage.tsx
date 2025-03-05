import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import BudgetForm from "./BudgetForm";
import BudgetList from "./BudgetList";
import { useAppSelector } from "../features/hooks";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { makeBudgetList } from "../helpers/makeBudgetList";
import { BudgetListInterface } from "../interfaces/budgetInterfaces";

const BudgetPage: React.FC = () => {
  const navigate = useNavigate();
  const userStatus: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo
  );
  const budgetList: BudgetListInterface[] = useMemo<BudgetListInterface[]>(
    () => makeBudgetList(userStatus.user!.budgets),
    [userStatus.user!.budgets]
  );
  const [showBudgetForm, setShowBudgetForm] = useState<boolean>(false);

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
      <header>
        <nav className="buttons sticky top-0 bg-emerald-900 flex justify-around p-2 w-full">
          <button
            className="back-button border-2 border-gray-500 p-1 sm:p-2 rounded-full text-white bg-gray-400 hover:bg-gray-200 hover:text-black active:bg-gray-100"
            onClick={() => navigate("/")}
          >
            Back Home
          </button>
          <button
            className="add-budget-form-button border-2 border-green-500 p-1 sm:p-2 rounded-full bg-green-300 hover:bg-green-500 hover:text-white active:bg-green-200"
            onClick={() => setShowBudgetForm(true)}
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
