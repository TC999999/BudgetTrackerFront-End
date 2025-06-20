import { BudgetInterface } from "../interfaces/budgetInterfaces";

import Buttons from "../motionWrappers/Buttons";

type Props = {
  currentBudget: BudgetInterface;
  showFormState: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent,
    form: "showExpenseForm" | "showDeleteForm" | "showEditForm"
  ) => void;
};

// additional navigation buttons bar for the single budget page
const SingleBudgetButtons: React.FC<Props> = ({
  currentBudget,
  showFormState,
}) => {
  return (
    <Buttons>
      <nav
        role="navigation"
        aria-label="budget-page-nav"
        className="flex justify-around w-full"
      >
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
    </Buttons>
  );
};

export default SingleBudgetButtons;
