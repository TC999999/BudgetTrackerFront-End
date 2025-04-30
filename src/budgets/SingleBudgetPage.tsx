import { useParams } from "react-router-dom";
import BudgetPageCard from "./BudgetPageCard";
import ExpenseForm from "../expenses/ExpenseForm";
import ExpenseList from "../expenses/ExpenseList";
import DeleteBudgetForm from "./DeleteBudgetForm";
import EditBudgetForm from "./EditBudgetForm";
import SingleBudgetButtons from "./SingleBudgetButtons";
import ListHeader from "../ListHeader";
import { getRemainingMoney } from "../helpers/getRemainingMoney";
import useSingleBudget from "./hooks/useSingleBudget";

type FormStateInterface = {
  showExpenseForm: boolean;
  showDeleteForm: boolean;
  showEditForm: boolean;
};

// returns page for a single user's budget based on budget id ("/budgets/:id")
const SingleBudgetPage = (): JSX.Element => {
  const { budgetID, id } = useParams();

  const initialFormState: FormStateInterface = {
    showExpenseForm: false,
    showDeleteForm: false,
    showEditForm: false,
  };

  const {
    currentBudget,
    expenses,
    formsState,
    showFormState,
    changeFormState,
    updateBudget,
    addExpense,
    filterExpense,
  } = useSingleBudget({ budgetID, id, initialFormState });

  return (
    <div id="single-budget-page">
      <SingleBudgetButtons
        currentBudget={currentBudget}
        showFormState={showFormState}
      />
      <main>
        <BudgetPageCard budget={currentBudget} />
        {formsState.showEditForm && (
          <EditBudgetForm
            budget={currentBudget}
            hideEditForm={changeFormState}
            updateBudget={updateBudget}
          />
        )}
        {formsState.showDeleteForm && (
          <DeleteBudgetForm
            hideDeleteForm={changeFormState}
            budget={currentBudget}
          />
        )}
        {formsState.showExpenseForm && (
          <ExpenseForm
            hideExpenseForm={changeFormState}
            budget={currentBudget}
            addExpense={addExpense}
            updateBudget={updateBudget}
          />
        )}
        <section id="budget-expense-list">
          <ListHeader type="Expenses" />
          <ExpenseList
            expensesList={expenses}
            isFrontPage={false}
            budgetID={budgetID}
            filterExpense={filterExpense}
            updateBudget={updateBudget}
            budgetFunds={{
              moneyRemaining: getRemainingMoney(
                currentBudget.moneyAllocated,
                currentBudget.moneySpent
              ),
              moneySpent: currentBudget.moneySpent,
            }}
          />
        </section>
      </main>
    </div>
  );
};

export default SingleBudgetPage;
