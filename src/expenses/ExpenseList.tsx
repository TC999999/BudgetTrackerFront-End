import { useState, useCallback } from "react";
import ExpenseCard from "./ExpenseCard";
import TableSkeletonCard from "../skeleton/TableSkeletonCard";
import SecondPrompt from "../SecondPrompt";
import {
  ExpenseInterface,
  deleteExpenseInterface,
} from "../interfaces/expenseInterfaces";
import { UserContextInterface } from "../interfaces/userInterfaces";
import { budgetFunds, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { error, infoInterface } from "../interfaces/miscTypes";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { AppDispatch } from "../features/store";
import { shallowEqual } from "react-redux";
import { setFormLoading } from "../features/slices/loadSlice";
import ExpenseAPI from "../apis/ExpenseAPI";
import { toast, Id } from "react-toastify";
import { loading } from "../interfaces/loadingInterfaces";

// isFrontPage prop tells frontend if user is on dashboard or single budget page; passes down to expense card.
type Props = {
  expensesList: ExpenseInterface[];
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
  const { user }: UserContextInterface = useAppSelector(
    (store) => store.user.userInfo,
    shallowEqual
  );

  const { pageLoading }: loading = useAppSelector(
    (store) => store.loading.loadingInfo,
    shallowEqual
  );

  const dispatch: AppDispatch = useAppDispatch();

  const [selectedExpense, setSelectedExpense] = useState<infoInterface | null>(
    null
  );
  const notifyDelete = (expenseTitle: string): Id =>
    toast.success(`${expenseTitle} expense successfully deleted`);

  const notifyError = (error: error): Id =>
    toast.error(`${error.status} Error: ${error.message}`);

  // since filterExpense is an optional prop function, this function calls on filterExpense
  // if it exists
  const callFilterExpense = (id: string) => {
    if (filterExpense) {
      filterExpense(id);
    }
  };

  // since updateBudget is an optional prop function, this function calls on updateBudget
  // if it exists
  const callUpdateBudget = (updatedBudget: BudgetUpdate) => {
    if (updateBudget) {
      updateBudget(updatedBudget);
    }
  };

  // updates state to show the prompt window for when a user clicks delete
  // expense button on an expense card
  const showSecondPrompt = useCallback(
    (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      expense: infoInterface
    ): void => {
      e.preventDefault();
      setSelectedExpense(expense);
    },
    [selectedExpense]
  );

  // updates state to hide the prompt window for when a user either clicks cancel on the prompt window or
  // after the user successfully submits a delete request
  const hidePrompt = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      setSelectedExpense(null);
    },
    [selectedExpense]
  );

  // makes a request to delete a single expense from the db, and if the user is on the single
  // budget page, update the expense list state with that expense filtered out; additionally,
  // update the budget value to account for the money spent on that expense
  const deleteExpense = useCallback(
    async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      info: infoInterface
    ): Promise<void> => {
      try {
        e.preventDefault();
        dispatch(setFormLoading(true));
        if (budgetID) {
          let submitData: deleteExpenseInterface = {
            _id: info._id,
            transaction: info.transaction!,
            budgetID,
          };
          let { delExpense, newUserBudget } = await ExpenseAPI.deleteExpense(
            submitData,
            user!._id
          );
          callFilterExpense(delExpense._id);
          callUpdateBudget(newUserBudget);
          setSelectedExpense(null);
          notifyDelete(delExpense.title);
        }
      } catch (err: any) {
        notifyError(JSON.parse(err.message));
      } finally {
        dispatch(setFormLoading(false));
      }
    },
    []
  );

  return (
    <div
      id="expense-list"
      className="bg-white border-2 border-green-500 m-2 rounded-md h-full"
    >
      {selectedExpense && (
        <SecondPrompt
          deleteFunction={deleteExpense}
          itemForDeletion={selectedExpense}
          hidePrompt={hidePrompt}
          type={"Expense"}
          BudgetFunds={budgetFunds}
        />
      )}
      <header
        id="expense-list-headers"
        className="grid grid-cols-4 bg-green-200 border-b-2 border-green-500 p-2"
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
                  isFrontPage={isFrontPage}
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

        {!pageLoading && expensesList.length === 0 && (
          <div className="no-expenses text-center text-xl p-4">
            <p className="italic"> No Expenses Yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
