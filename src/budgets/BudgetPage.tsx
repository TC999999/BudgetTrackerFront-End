import { useParams } from "react-router-dom";
import ListHeader from "../ListHeader";
import NewBudgetForm from "./NewBudgetForm";
import BudgetList from "./BudgetList";
import BudgetPageButtons from "./BudgetPageButtons";
import useBudgetPage from "./hooks/useBudgetPage";
import Page from "../motionWrappers/Page";

type Props = {
  mock?: any;
};

// returns page for list of all budgets the user currently has
const BudgetPage: React.FC<Props> = ({ mock }): JSX.Element => {
  const { id } = useParams();
  const { budgetList, showBudgetForm, addBudget, showForm, hideForm } =
    useBudgetPage(id, mock);

  return (
    <div id="all-budget-page">
      <BudgetPageButtons
        budgetListLength={budgetList.length}
        showForm={showForm}
      />
      <Page>
        <main>
          <ListHeader type="Budgets" itemListLength={budgetList.length} />
          <NewBudgetForm
            hideForm={hideForm}
            addBudget={addBudget}
            show={showBudgetForm}
          />
          <BudgetList allBudgets={budgetList} />
        </main>
      </Page>
    </div>
  );
};

export default BudgetPage;
