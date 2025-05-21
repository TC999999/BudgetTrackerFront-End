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
import Page from "../motionWrappers/Page";

// returns page for a single user's budget based on budget id ("/budgets/:id")
const SingleBudgetPage = (): JSX.Element => {
  const { budgetID, id } = useParams();

  const {
    currentBudget,
    expenses,
    formsState,
    showFormState,
    changeFormState,
    updateBudget,
    addExpense,
    filterExpense,
  } = useSingleBudget({ budgetID, id });

  return (
    <div id="single-budget-page">
      <SingleBudgetButtons
        currentBudget={currentBudget}
        showFormState={showFormState}
      />
      <Page>
        <main>
          <BudgetPageCard budget={currentBudget} />

          {currentBudget.moneyAllocated && currentBudget.moneySpent && (
            <div id="budget-forms">
              <EditBudgetForm
                budget={currentBudget}
                hideEditForm={changeFormState}
                updateBudget={updateBudget}
                show={formsState.showEditForm}
              />

              <DeleteBudgetForm
                hideDeleteForm={changeFormState}
                budget={currentBudget}
                show={formsState.showDeleteForm}
              />

              <ExpenseForm
                hideExpenseForm={changeFormState}
                budget={currentBudget}
                addExpense={addExpense}
                updateBudget={updateBudget}
                show={formsState.showExpenseForm}
              />
            </div>
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
      </Page>
    </div>
  );
};

export default SingleBudgetPage;
