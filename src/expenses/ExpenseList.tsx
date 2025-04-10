import { useState, useCallback } from "react";
import ExpenseCard from "./ExpenseCard";
import SecondPrompt from "../SecondPrompt";
import {
  ExpenseInterface,
  deleteExpenseInterface,
} from "../interfaces/expenseInterfaces";
import { budgetFunds, BudgetUpdate } from "../interfaces/budgetInterfaces";
import { useAppSelector, useAppDispatch } from "../features/hooks";
import { setSmallLoading } from "../features/auth/authSlice";
import { infoInterface } from "../interfaces/miscTypes";
import ExpenseAPI from "../apis/ExpenseAPI";
import { toast } from "react-toastify";

// isFrontPage prop tells frontend if user is on dashboard or single budget page; passes down to expense card.
type Props = {
  expensesList: ExpenseInterface[];
  isFrontPage: boolean;
  budgetID: string | null;
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
  const userStatus = useAppSelector((store) => store.user.userInfo);
  const dispatch = useAppDispatch();
  const [selectedExpense, setSelectedExpense] = useState<infoInterface | null>(
    null
  );
  const notifyDelete = (expenseTitle: string) =>
    toast.success(`${expenseTitle} expense successfully deleted`);
  const notifyError = (message: string) => toast.error(message);

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
        dispatch(setSmallLoading(true));

        let submitData: deleteExpenseInterface = {
          _id: info._id,
          transaction: info.transaction!,
          budgetID,
        };
        let { delExpense, newUserBudget } = await ExpenseAPI.deleteExpense(
          submitData,
          userStatus.user!._id
        );
        callFilterExpense(delExpense._id);
        callUpdateBudget(newUserBudget);
        notifyDelete(delExpense.title);
      } catch (err: any) {
        notifyError(err.message);
      } finally {
        dispatch(setSmallLoading(false));
      }
    },
    []
  );

  return (
    <div>
      {selectedExpense && (
        <SecondPrompt
          deleteFunction={deleteExpense}
          itemForDeletion={selectedExpense}
          hidePrompt={hidePrompt}
          type={"Expense"}
          BudgetFunds={budgetFunds}
        />
      )}
      <div className="expense-list bg-white border-2 border-green-500 m-2 rounded-md">
        <header className="expense-list-headers grid grid-cols-4 bg-green-200 border-b-2 border-green-500 px-4 py-2">
          <b className="text-sm sm:text-base duration-150 text-center content-center">
            Name
          </b>

          <b className="text-sm sm:text-base duration-150 text-center content-center">
            Cost
          </b>

          {isFrontPage && (
            <b className="text-sm sm:text-base duration-150 text-center content-center">
              Budget
            </b>
          )}

          <b className="text-sm sm:text-base duration-150 text-center content-center">
            Date
          </b>

          {!isFrontPage && (
            <b className="text-sm sm:text-base duration-150 text-center content-center">
              Delete
            </b>
          )}
        </header>
        <div className="expense-card-list striped">
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
          {!expensesList.length && (
            <div className="no-expenses text-center text-xl p-6">
              <p className="italic">No Expenses Yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
