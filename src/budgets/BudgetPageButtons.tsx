type Props = {
  budgetListLength: number;
  showForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

// shows a row of buttons for budgets page
const BudgetPageButtons: React.FC<Props> = ({ budgetListLength, showForm }) => {
  return (
    <header id="additional-nav-header" className="animate-additional-buttons">
      <nav className="buttons flex justify-around w-full">
        <button
          id="show-budget-form-button"
          className={`nav-button border-green-500 bg-green-300 ${
            budgetListLength < 10
              ? "hover:bg-green-500 hover:text-white active:bg-green-200"
              : "cursor-not-allowed"
          }`}
          onClick={(e) => showForm(e)}
        >
          Add a new Budget
        </button>
      </nav>
    </header>
  );
};

export default BudgetPageButtons;
