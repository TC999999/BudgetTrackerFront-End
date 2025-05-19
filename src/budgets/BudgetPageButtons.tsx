import useNavAnimation from "../hooks/useNavAnimation";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  budgetListLength: number;
  showForm: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

// shows a row of buttons for budgets page
const BudgetPageButtons: React.FC<Props> = ({ budgetListLength, showForm }) => {
  const { aniID, handleEntranceAnimationEnd } = useNavAnimation();
  return (
    <header
      id={aniID}
      className="animate-additional-buttons-entrance"
      onAnimationEnd={handleEntranceAnimationEnd}
    >
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
