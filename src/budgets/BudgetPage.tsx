import { useParams } from "react-router-dom";
import ListHeader from "../ListHeader";
import NewBudgetForm from "./NewBudgetForm";
import BudgetList from "./BudgetList";
import BudgetPageButtons from "./BudgetPageButtons";
import useBudgetPage from "./hooks/useBudgetPage";

// returns page for list of all budgets the user currently has
const BudgetPage = (): JSX.Element => {
  const { id } = useParams();
  const { budgetList, showBudgetForm, addBudget, showForm, hideForm } =
    useBudgetPage(id);

  return (
    <div id="all-budget-page">
      <BudgetPageButtons
        budgetListLength={budgetList.length}
        showForm={showForm}
      />
      <main className="relative animate-page-entrance">
        <ListHeader type="Budgets" itemListLength={budgetList.length} />
        {showBudgetForm && (
          <NewBudgetForm hideForm={hideForm} addBudget={addBudget} />
        )}

        <BudgetList allBudgets={budgetList} />
      </main>
    </div>
  );
};

export default BudgetPage;
