import ExpenseCard from "./ExpenseCard";
import TableSkeletonCard from "../skeleton/TableSkeletonCard";
import SecondPrompt from "../SecondPrompt";
import {
  ExpenseInterface,
  RecentExpense,
} from "../interfaces/expenseInterfaces";
import { budgetFunds, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { useAppSelector } from "../features/hooks";
import { shallowEqual } from "react-redux";
import { loading } from "../interfaces/loadingInterfaces";
import useExpenseList from "./hooks/useExpenseList";

// isFrontPage prop tells frontend if user is on dashboard or single budget page; passes down to expense card.
type Props = {
  expensesList: ExpenseInterface[] | RecentExpense[];
  isFrontPage: boolean;
  budgetID?: string;
  filterExpense?: (id: string) => void;
  updateBudget?: (updatedBudget: BudgetUpdate) => void;
  budgetFunds?: budgetFunds;
};

// returns expense list to be used for budget expenses on a single budget page and a user's most recent
// expenses on the dashboard
const ExpenseList: React.FC<Props> = ({
  expensesList,
  isFrontPage,
  budgetID,
  filterExpense,
  updateBudget,
  budgetFunds,
}): JSX.Element => {
  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const {
    selectedExpense,
    showDeleteExpenseForm,
    showSecondPrompt,
    hidePrompt,
    deleteExpense,
  } = useExpenseList({ budgetID, filterExpense, updateBudget });

  return (
    <div
      id="expense-list"
      className="bg-white border-2 border-green-500 m-2 rounded-md"
    >
      {selectedExpense && (
        <SecondPrompt
          deleteFunction={deleteExpense}
          itemForDeletion={selectedExpense}
          hidePrompt={hidePrompt}
          type={"Expense"}
          BudgetFunds={budgetFunds}
          show={showDeleteExpenseForm}
        />
      )}
      <header
        id="expense-list-headers"
        className="grid grid-cols-4 bg-green-200 border-b-2 border-green-500 p-2 rounded-t-sm"
      >
        <b className="table-header">Name</b>
        <b className="table-header">Cost</b>
        <b className="table-header">Date</b>
        {isFrontPage ? (
          <b className="table-header">Budget</b>
        ) : (
          <b className="table-header">Delete</b>
        )}
      </header>

      <div id="expense-card-list" className="striped">
        {!pageLoading && expensesList.length > 0 && (
          <div>
            {expensesList.map((e) => {
              return (
                <ExpenseCard
                  key={e._id}
                  expense={e}
                  showSecondPrompt={showSecondPrompt}
                />
              );
            })}
          </div>
        )}

        {pageLoading && (
          <div>
            <TableSkeletonCard cards={5} cols="4" />
          </div>
        )}

        {!pageLoading && !expensesList.length && (
          <div className="no-expenses text-center text-xl p-2">
            <p className="italic">No Expenses Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
