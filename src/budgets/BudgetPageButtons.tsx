import { BudgetListInterface } from "../interfaces/budgetInterfaces";

type Props = {
  budgetList: BudgetListInterface[];
  showForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const BudgetPageButtons: React.FC<Props> = ({ budgetList, showForm }) => {
  return (
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
  );
};

export default BudgetPageButtons;
